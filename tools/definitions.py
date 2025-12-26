tools = [
    {
        "type": "function",
        "name": "browser_action",
        "description": "Control the web browser to demonstrate features. Use this to navigate, click, type, or scroll.",
        "parameters": {
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["click", "type", "scroll", "goto", "hover"],
                    "description": "The specific browser interaction to perform."
                },
                "selector": {
                    "type": "string",
                    "description": "The CSS selector or text description of the element (e.g., 'text=Sign Up' or '#submit-btn')."
                },
                "value": {
                    "type": "string",
                    "description": "The text to type (only for 'type' action) or URL to visit (for 'goto')."
                }
            },
            "required": ["action", "selector"]
        }
    }
]
