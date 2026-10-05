#!/usr/bin/env python3
"""Exporta um dataset analítico tratado e desidentificado do SQLite do Acolhe."""
import csv, json, os, sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / 'data' / 'acolhe.db'
OUT = ROOT / 'data' / 'analytics' / 'dataset_tratado.csv'
META = ROOT / 'data' / 'analytics' / 'dataset_tratado.meta.json'
OUT.parent.mkdir(parents=True, exist_ok=True)

columns = ['id', 'data_criacao', 'tipo_denuncia', 'tipo_violencia', 'status', 'arquivada', 'quantidade_anexos', 'bytes_anexos']
rows = []
if DB.exists():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    query = '''SELECT id, criado_em, tipo_denuncia, tipo_violencia, status, excluida_em, arquivos
               FROM denuncias ORDER BY id'''
    for item in conn.execute(query):
        try:
            files = json.loads(item['arquivos'] or '[]')
            files = files if isinstance(files, list) else []
        except (TypeError, json.JSONDecodeError):
            files = []
        rows.append({
            'id': item['id'],
            'data_criacao': item['criado_em'],
            'tipo_denuncia': 'anonima' if item['tipo_denuncia'] == 'anon' else 'identificada',
            'tipo_violencia': item['tipo_violencia'],
            'status': item['status'],
            'arquivada': 1 if item['excluida_em'] else 0,
            'quantidade_anexos': len(files),
            'bytes_anexos': sum(int(f.get('size') or 0) for f in files if isinstance(f, dict)),
        })
    conn.close()
with OUT.open('w', newline='', encoding='utf-8') as handle:
    writer = csv.DictWriter(handle, fieldnames=columns)
    writer.writeheader()
    writer.writerows(rows)
metadata = {
    'arquivo': str(OUT.relative_to(ROOT)),
    'observacoes': len(rows),
    'colunas': columns,
    'origem': 'SQLite data/acolhe.db / tabela denuncias',
    'tratamento': [
        'remoção de descrição, nome, telefone e e-mail para desidentificação',
        'normalização de tipo_denuncia para anonima/identificada',
        'conversão de excluida_em para indicador arquivada',
        'derivação de quantidade_anexos e bytes_anexos a partir dos metadados',
    ],
    'gerado_em_utc': __import__('datetime').datetime.now(__import__('datetime').timezone.utc).isoformat(),
}
META.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Exportado: {OUT} ({len(rows)} observações)')
