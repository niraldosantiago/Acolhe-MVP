import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Configuração visual dos gráficos
plt.style.use('seaborn-v0_8-whitegrid')
os.makedirs('data/processado', exist_ok=True)
os.makedirs('data/graficos', exist_ok=True)

def carregar_e_tratar_dados():
    # 1. COLETA (Conexão com a base de dados SQLite do projeto)
    conn = sqlite3.connect('acolhe.db')
    query = "SELECT * FROM denuncias"
    df = pd.read_sql_query(query, conn)
    conn.close()

    if df.empty:
        print("A base de dados não contém registos para análise.")
        return None

    # 2. TRATAMENTO E LIMPEZA DOS DADOS
    # Converte colunas de data para tipo datetime
    df['criado_em'] = pd.to_datetime(df['criado_em'], errors='coerce')
    
    # Padronização de textos e preenchimento de valores ausentes
    df['tipo_denuncia'] = df['tipo_denuncia'].map({'anon': 'Anónima', 'identified': 'Identificada'}).fillna('Desconhecido')
    df['tipo_violencia'] = df['tipo_violencia'].str.capitalize().fillna('Não Especificado')
    df['status'] = df['status'].fillna('Pendente')

    # Extração de variáveis temporais
    df['ano_mes'] = df['criado_em'].dt.to_period('M').astype(str)
    df['dia_semana'] = df['criado_em'].dt.day_name()

    # Salva o Dataset Tratado em CSV
    caminho_csv = 'data/processado/dataset_denuncias_tratado.csv'
    df.to_csv(caminho_csv, index=False, encoding='utf-8-sig')
    print(f"Dataset tratado guardado com sucesso em: {caminho_csv}")

    return df

def gerar_visualizacoes(df):
    if df is None or df.empty:
        return

    # 3. EXPLORAÇÃO E GERADORES DE GRÁFICOS (DASHBOARD)
    
    # Gráfico 1: Distribuição por Tipo de Violência
    plt.figure(figsize=(8, 5))
    ax = sns.countplot(data=df, x='tipo_violencia', palette='viridis')
    plt.title('Distribuição de Denúncias por Tipo de Violência', fontsize=14, fontweight='bold')
    plt.xlabel('Tipo de Violência')
    plt.ylabel('Total de Denúncias')
    plt.xticks(rotation=15)
    plt.tight_layout()
    plt.savefig('data/graficos/01_tipo_violencia.png', dpi=300)
    plt.close()

    # Gráfico 2: Proporção de Denúncias Anónimas vs Identificadas
    plt.figure(figsize=(6, 6))
    df['tipo_denuncia'].value_counts().plot.pie(autopct='%1.1f%%', colors=['#4c72b0', '#55a868'], startangle=90)
    plt.title('Proporção de Denúncias (Anónima vs Identificada)', fontsize=14, fontweight='bold')
    plt.ylabel('')
    plt.tight_layout()
    plt.savefig('data/graficos/02_anonimas_vs_identificadas.png', dpi=300)
    plt.close()

    # Gráfico 3: Estado Atual das Denúncias
    plt.figure(figsize=(8, 5))
    sns.countplot(data=df, x='status', palette='magma')
    plt.title('Estado do Processamento das Denúncias', fontsize=14, fontweight='bold')
    plt.xlabel('Estado')
    plt.ylabel('Quantidade')
    plt.tight_layout()
    plt.savefig('data/graficos/03_status_denuncias.png', dpi=300)
    plt.close()

    print("Gráficos analíticos gerados com sucesso na pasta 'data/graficos/'.")

if __name__ == '__main__':
    df_tratado = carregar_e_tratar_dados()
    gerar_visualizacoes(df_tratado)