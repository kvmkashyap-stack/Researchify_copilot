from typing import List, Any
import os
import math
import httpx

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

# Redirect HF cache to /tmp for Vercel
os.environ["HF_HOME"] = "/tmp/hf_cache"

# =====================================
# Hugging Face Inference API Embeddings Fallback
# =====================================

class HuggingFaceInferenceEmbeddings:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.api_url = f"https://api-inference.huggingface.co/models/{model_name}"
        self.headers = {}
        hf_token = os.getenv("HF_TOKEN")
        if hf_token:
            self.headers["Authorization"] = f"Bearer {hf_token}"

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        try:
            resp = httpx.post(
                self.api_url,
                json={"inputs": texts},
                headers=self.headers,
                timeout=30
            )
            if resp.status_code == 200:
                return resp.json()
            else:
                print(f"[HF Embeddings Error] {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"[HF Embeddings Exception] {e}")
        return [[0.0] * 384 for _ in texts]

    def embed_query(self, text: str) -> List[float]:
        try:
            resp = httpx.post(
                self.api_url,
                json={"inputs": text},
                headers=self.headers,
                timeout=30
            )
            if resp.status_code == 200:
                result = resp.json()
                if isinstance(result, list) and len(result) > 0:
                    if isinstance(result[0], list):
                        return result[0]
                    return result
            else:
                print(f"[HF Query Embedding Error] {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"[HF Query Embedding Exception] {e}")
        return [0.0] * 384


# =====================================
# Simple 0-Dependency Vector Store Fallback
# =====================================

class SimpleVectorStore:
    @classmethod
    def from_documents(cls, documents: List[Document], embeddings_model: Any):
        return cls(documents, embeddings_model)

    def __init__(self, documents: List[Document], embeddings_model: Any):
        self.documents = documents
        self.embeddings_model = embeddings_model
        texts = [doc.page_content for doc in documents]
        self.doc_embeddings = embeddings_model.embed_documents(texts)

    def similarity_search(self, query: str, k: int = 3) -> List[Document]:
        query_embedding = self.embeddings_model.embed_query(query)
        similarities = []
        for doc_emb in self.doc_embeddings:
            # Cosine similarity: dot(A, B) / (norm(A) * norm(B))
            dot_product = sum(a * b for a, b in zip(query_embedding, doc_emb))
            norm_a = sum(a * a for a in query_embedding) ** 0.5
            norm_b = sum(b * b for b in doc_emb) ** 0.5
            similarity = dot_product / (norm_a * norm_b) if norm_a * norm_b > 0 else 0.0
            similarities.append(similarity)
        
        sorted_indices = sorted(range(len(similarities)), key=lambda idx: similarities[idx], reverse=True)
        return [self.documents[idx] for idx in sorted_indices[:k]]


# =====================================
# Initialize Embeddings
# =====================================

try:
    from langchain_community.embeddings import HuggingFaceEmbeddings
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
except Exception:
    embeddings = HuggingFaceInferenceEmbeddings()


# =====================================
# Vector Store Ingestion & Search
# =====================================

vector_store = None

try:
    from langchain_community.vectorstores import FAISS
    def create_vector_store(documents):
        global vector_store
        vector_store = FAISS.from_documents(documents, embeddings)
        return vector_store
except Exception:
    def create_vector_store(documents):
        global vector_store
        vector_store = SimpleVectorStore.from_documents(documents, embeddings)
        return vector_store


def load_pdf(file_path: str):
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    return documents


def split_documents(documents: List[Document]):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = splitter.split_documents(documents)
    return chunks


def ingest_pdf(file_path: str):
    documents = load_pdf(file_path)
    chunks = split_documents(documents)
    create_vector_store(chunks)
    return {
        "message": "PDF indexed successfully",
        "chunks": len(chunks)
    }


def search_documents(query: str, k: int = 3):
    global vector_store
    if vector_store is None:
        return []
    results = vector_store.similarity_search(query, k=k)
    return results