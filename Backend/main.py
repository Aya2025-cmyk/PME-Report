from fastapi import FastAPI
from routes.ventes import router as ventes_router
from routes.depenses import router as depenses_router
from routes.clients import router as clients_router
from routes.ai import router as ai_router

app = FastAPI()

app.include_router(ventes_router, prefix="/api/ventes")
app.include_router(depenses_router, prefix="/api/depenses")
app.include_router(clients_router, prefix="/api/clients")
app.include_router(ai_router, prefix="/api/ia")

@app.get("/")
def home():
    return {"message": "Backend PME Report is running!"}
