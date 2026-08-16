from fastapi import FastAPI

app = FastAPI(
    title ="URL Shortner API",
    description = "Backend API for the URL Shortener system design project.",
    version ="0.1.0",
)

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "ok",
        "service": "url-shortener-backend",
    }
