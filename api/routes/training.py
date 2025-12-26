# Training endpoints - Product crawling and learning

from fastapi import APIRouter, HTTPException, BackgroundTasks
from api.models.schemas import ProductCreate, Product, TrainingStartRequest, TrainingStatus
from services.product_crawler import ProductCrawler
from services.database import db
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    """
    Register a new product for training.
    Seller provides URL and credentials.
    """
    product_id = f"prod_{uuid.uuid4().hex[:12]}"
    
    product_data = {
        "id": product_id,
        "seller_id": product.seller_id,
        "name": product.name,
        "url": product.url,
        "credentials": product.credentials.dict(),
        "training_status": "pending",
        "element_map": None,
        "demo_script": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Save to database
    await db.create_product(product_data)
    
    return Product(**product_data)

@router.post("/start", response_model=TrainingStatus)
async def start_training(
    request: TrainingStartRequest,
    background_tasks: BackgroundTasks
):
    """
    Start the training pipeline for a product.
    This crawls the website, maps elements, and generates demo script.
    """
    # Get product
    product = await db.get_product(request.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product["training_status"] == "in_progress":
        raise HTTPException(status_code=400, detail="Training already in progress")
    
    # Update status
    await db.update_product(request.product_id, {
        "training_status": "in_progress",
        "updated_at": datetime.utcnow()
    })
    
    # Start crawler in background
    crawler = ProductCrawler()
    background_tasks.add_task(
        crawler.crawl_and_train,
        product_id=request.product_id,
        url=product["url"],
        credentials=product["credentials"],
        include_docs=request.include_docs,
        doc_urls=request.doc_urls
    )
    
    return TrainingStatus(
        product_id=request.product_id,
        status="in_progress",
        progress=0,
        current_step="Initializing crawler"
    )

@router.get("/{product_id}/status", response_model=TrainingStatus)
async def get_training_status(product_id: str):
    """
    Check the status of product training.
    Frontend polls this endpoint to show progress.
    """
    product = await db.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get training progress from cache/database
    progress_data = await db.get_training_progress(product_id)
    
    return TrainingStatus(
        product_id=product_id,
        status=product["training_status"],
        progress=progress_data.get("progress", 0),
        current_step=progress_data.get("current_step", "Idle"),
        error=progress_data.get("error")
    )

@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get product details including training results."""
    product = await db.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return Product(**product)
