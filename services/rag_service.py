import logging
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.models import VectorizedQuery
from config import config
import os

logger = logging.getLogger(__name__)

class RAGService:
    """
    Azure AI Search integration for Retrieval-Augmented Generation.
    Allows the agent to query company documentation and knowledge base.
    """
    
    def __init__(self):
        # These would be added to config.py
        self.search_endpoint = os.getenv("AZURE_SEARCH_ENDPOINT", "")
        self.search_key = os.getenv("AZURE_SEARCH_KEY", "")
        self.index_name = os.getenv("AZURE_SEARCH_INDEX", "knowledge-base")
        
        if not self.search_endpoint or not self.search_key:
            logger.warning("Azure AI Search not configured. RAG features disabled.")
            self.enabled = False
            return
            
        self.enabled = True
        self.credential = AzureKeyCredential(self.search_key)
        self.search_client = SearchClient(
            endpoint=self.search_endpoint,
            index_name=self.index_name,
            credential=self.credential
        )
    
    async def search(self, query: str, top_k: int = 3) -> str:
        """
        Search the knowledge base and return relevant context.
        
        Args:
            query: User's question
            top_k: Number of results to return
            
        Returns:
            Formatted context string to inject into the AI prompt
        """
        if not self.enabled:
            return ""
        
        try:
            results = self.search_client.search(
                search_text=query,
                top=top_k,
                select=["content", "title", "source"]
            )
            
            context_parts = []
            for result in results:
                context_parts.append(
                    f"[{result['title']}]\n{result['content']}\nSource: {result['source']}\n"
                )
            
            if context_parts:
                return "Relevant Information:\n" + "\n---\n".join(context_parts)
            else:
                return ""
                
        except Exception as e:
            logger.error(f"RAG search failed: {e}")
            return ""
    
    async def ingest_document(self, title: str, content: str, source: str):
        """
        Add a document to the knowledge base.
        
        Args:
            title: Document title
            content: Document content
            source: Source URL or file path
        """
        if not self.enabled:
            return
        
        try:
            document = {
                "id": f"{hash(title + source)}",
                "title": title,
                "content": content,
                "source": source
            }
            
            self.search_client.upload_documents([document])
            logger.info(f"Ingested document: {title}")
            
        except Exception as e:
            logger.error(f"Document ingestion failed: {e}")
