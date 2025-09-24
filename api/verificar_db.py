# verificar_db.py

import sqlite3
import pandas as pd

# Conecta ao banco
conn = sqlite3.connect('resultados.db')

# Cria um cursor
cursor = conn.cursor()

# Verifica se a tabela 'capitulos' existe
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='capitulos'")
tabela = cursor.fetchone()

if tabela:
    print("✅ Tabela 'capitulos' encontrada.")
    
    # Lê as 5 primeiras linhas
    df = pd.read_sql_query("SELECT * FROM capitulos LIMIT 5", conn)
    print("\n📝 Primeiros registros:")
    print(df)

    # Conta o total de linhas
    cursor.execute("SELECT COUNT(*) FROM capitulos")
    total = cursor.fetchone()[0]
    print(f"\n📊 Total de registros: {total}")
else:
    print("❌ Tabela 'capitulos' não encontrada no banco.")

# Fecha conexão
conn.close()
