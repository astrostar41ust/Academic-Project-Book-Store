from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins for simplicity. In production, you'd restrict this.
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

@app.get("/api/message")
def get_message():
    return {"message": "Hello from the Python Backend!"}

@app.get("/")
def read_root():
    return {"status": "Backend is running"}