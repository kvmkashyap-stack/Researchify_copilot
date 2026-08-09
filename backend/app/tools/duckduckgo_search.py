from langchain_community.tools import DuckDuckGoSearchRun


# Create search tool

search_tool = DuckDuckGoSearchRun()


def web_search(query: str):

    """
    Searches the web using DuckDuckGo
    """

    result = search_tool.run(query)

    return result