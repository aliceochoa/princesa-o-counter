from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

# Libera acesso do front-end
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/capitulos")
def get_capitulos(
    min: int = Query(1, alias="min"),
    max: int = Query(173, alias="max"),
    palavras: list[str] = Query(default=["princesa", "princeso"]),
    ordenar: str = Query("nenhuma"),
    ocultar: bool = Query(False)
):
    # Conexão com o novo banco
    conn = sqlite3.connect("resultados.db")
    cursor = conn.cursor()

    # Base da query
    query = f"SELECT capitulo, data, princesa, princeso FROM capitulos WHERE capitulo BETWEEN ? AND ?"
    params = [min, max]

    # Filtrar palavras com valor > 0 se ocultar=True
    if ocultar:
        conditions = []
        if "princesa" in palavras:
            conditions.append("princesa > 0")
        if "princeso" in palavras:
            conditions.append("princeso > 0")
        if conditions:
            query += " AND (" + " OR ".join(conditions) + ")"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    # Transformar em lista de dicionários
    dados = []
    for row in rows:
        item = {
            "capitulo": row[0],
            "data": row[1]
        }
        if "princesa" in palavras:
            item["princesa"] = row[2]
        if "princeso" in palavras:
            item["princeso"] = row[3]
        dados.append(item)

    # Ordenação
    if ordenar == "crescente":
        dados.sort(key=lambda x: (x.get("princesa", 0) + x.get("princeso", 0)))
    elif ordenar == "decrescente":
        dados.sort(key=lambda x: (x.get("princesa", 0) + x.get("princeso", 0)), reverse=True)
    else:
       dados.sort(key=lambda x: x["capitulo"])

    return dados
