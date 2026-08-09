from typing import List

from langchain_community.vectorstores import FAISS

from langchain_community.embeddings import HuggingFaceEmbeddings

from langchain_community.document_loaders import PyPDFLoader

from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_core.documents import Document


# =====================================
# Embedding Model
# =====================================

import os
os.environ["HF_HOME"] = "/tmp/hf_cache"

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)



# =====================================
# Vector Store
# =====================================

vector_store = None



# =====================================
# Load PDF
# =====================================

def load_pdf(
    file_path: str
):

    loader = PyPDFLoader(
        file_path
    )


    documents = loader.load()


    return documents



# =====================================
# Split Documents
# =====================================

def split_documents(
    documents: List[Document]
):


    splitter = RecursiveCharacterTextSplitter(

        chunk_size=1000,

        chunk_overlap=200

    )


    chunks = splitter.split_documents(
        documents
    )


    return chunks



# =====================================
# Create FAISS Database
# =====================================

def create_vector_store(
    documents
):

    global vector_store


    vector_store = FAISS.from_documents(

        documents,

        embeddings

    )


    return vector_store



# =====================================
# Complete Ingestion Pipeline
# =====================================

def ingest_pdf(
    file_path: str
):


    documents = load_pdf(
        file_path
    )


    chunks = split_documents(
        documents
    )


    create_vector_store(
        chunks
    )


    return {

        "message":
        "PDF indexed successfully",

        "chunks":
        len(chunks)

    }



# =====================================
# Search Documents
# =====================================

def search_documents(

    query: str,

    k: int = 3

):


    if vector_store is None:

        return []



    results = vector_store.similarity_search(

        query,

        k=k

    )


    return results