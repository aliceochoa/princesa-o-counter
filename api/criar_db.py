import sqlite3
import pandas as pd
import os

# Caminhos
csv_path = "resultados.csv"
db_path = "resultados.db"

# Excluir banco antigo (opcional)
if os.path.exists(db_path):
    os.remove(db_path)

# Ler CSV com Pandas
df = pd.read_csv(csv_path)

# Renomeia as colunas para nomes consistentes com o código
df.rename(columns={
    'Capítulo': 'capitulo',
    'Data': 'data',
    'Nº ocorrências de "princesa"': 'princesa',
    'Nº ocorrências de "princeso"': 'princeso'
}, inplace=True)

# Conectar ao novo banco SQLite
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Criar tabela
cursor.execute('''
    CREATE TABLE capitulos (
        capitulo INTEGER PRIMARY KEY,
        data TEXT,
        princesa INTEGER,
        princeso INTEGER
    )
''')

# Inserir dados
for _, row in df.iterrows():
    cursor.execute('''
        INSERT INTO capitulos (capitulo, data, princesa, princeso)
        VALUES (?, ?, ?, ?)
    ''', (row['capitulo'], row['data'], row['princesa'], row['princeso']))

# Criar índices para performance
cursor.execute("CREATE INDEX IF NOT EXISTS idx_capitulo ON capitulos(capitulo)")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_princesa ON capitulos(princesa)")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_princeso ON capitulos(princeso)")

# Finalizar
conn.commit()
conn.close()

print("✅ Banco de dados criado com sucesso e otimizado com índices!")