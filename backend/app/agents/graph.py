from typing import List, Dict
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.tools import tool
from app.core.llm import llm

# =====================================
# Tools
# =====================================

@tool
def search_web(query: str):
    """
    Search internet using DuckDuckGo. Useful for finding latest news, facts, and updates on public figures, events, and topics.
    """
    from app.tools.duckduckgo_search import web_search
    try:
        return web_search(query)
    except Exception as e:
        return f"Error running web search: {str(e)}"

@tool
def search_rag(query: str):
    """
    Search internal documents. Useful for looking up contents of uploaded scientific papers and files.
    """
    from app.tools.rag import search_documents
    try:
        docs = search_documents(query)
        if not docs:
            return "No relevant documents found"
        return "\n".join([doc.page_content for doc in docs])
    except Exception as e:
        return f"Error searching documents: {str(e)}"

tools = [
    search_web,
    search_rag
]

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage

# =====================================
# Run Agent
# =====================================

def run_agent(message: str, history: List[Dict[str, str]] = None) -> str:
    if history is None:
        history = []
    
    # 1. System prompt
    system_prompt = (
        "You are AI Research Copilot, a premium AI research assistant.\n"
        "Always answer concisely, professionally, and factually.\n"
        "If you need to query internal documents or search the web, call the appropriate tool natively.\n"
        "If you don't need any tools to answer a general query, just reply directly."
    )
    
    messages = [SystemMessage(content=system_prompt)]
    
    # 2. Add history
    for msg in history:
        role = msg.get("role")
        content = msg.get("content") or msg.get("message") or ""
        if not content:
            continue
        if role == "user":
            messages.append(HumanMessage(content=content))
        elif role in ("assistant", "ai"):
            messages.append(AIMessage(content=content))

    # 3. Add current message
    messages.append(HumanMessage(content=message))

    # 4. Tool Execution Loop
    model_with_tools = llm.bind_tools(tools)
    
    for i in range(3):
        try:
            # On the last iteration, invoke without tools bound to force a final text summary
            if i == 2:
                response = llm.invoke(messages)
                return response.content
            else:
                response = model_with_tools.invoke(messages)
        except Exception as e:
            print(f"[Agent Warning] Failed invoking model with tools: {e}. Falling back to direct LLM.")
            try:
                # Direct fallback (no tools bound)
                fallback_response = llm.invoke(messages)
                return fallback_response.content
            except Exception as fe:
                print(f"[Agent Error] Direct LLM fallback failed: {fe}")
                raise e
        
        # If no tool calls requested, return text response
        if not response.tool_calls:
            return response.content
            
        messages.append(response)
        
        # Execute tool calls
        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]
            tool_id = tool_call["id"]
            
            print(f"[Agent] Executing tool: {tool_name} with args: {tool_args}")
            
            result = "Tool not found"
            for t in tools:
                if t.name == tool_name:
                    try:
                        result = t.invoke(tool_args)
                    except Exception as te:
                        result = f"Error executing tool: {str(te)}"
                    break
            
            messages.append(ToolMessage(content=str(result), tool_call_id=tool_id))

    return response.content