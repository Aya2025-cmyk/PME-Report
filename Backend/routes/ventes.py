from fastapi import APIRouter

router = APIRouter()

fake_ventes = []

@router.get("/")
def get_ventes():
    return fake_ventes

@router.post("/")
def add_vente(vente: dict):
    fake_ventes.append(vente)
    return {"message": "Vente ajoutée", "data": vente}
