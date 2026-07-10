#!/usr/bin/env python3
"""
Convierte un archivo Excel de fixtures a JSON usable por la página de `partidos`.

Uso:
  python import_fixtures.py /ruta/al/Fixture-Copa-Mundial-FIFA-2026_ClasesExcel.xlsx

Requisitos:
  pip install pandas openpyxl

Salida:
  web/core/static/data/partidos.json
  web/static/data/partidos.json
"""
import sys
import json
from datetime import date, datetime, time
from pathlib import Path

try:
    import pandas as pd
except Exception:
    print("Este script requiere pandas y openpyxl. Instala con: pip install pandas openpyxl")
    raise

GROUP_SHEETS = [chr(c) for c in range(ord('A'), ord('L') + 1)]
KNOCKOUT_SHEETS = {
    'Dieciseisavos': 'dieciseisavos',
    'Octavos': 'octavos',
    'Cuartos': 'cuartos',
    'Semifinales': 'finales',
    'FINAL': 'finales',
}


def normalize_text(value):
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return ''
    text = str(value).strip()
    if text == 'nan':
        return ''
    return text.replace('_', ' ').strip()


def normalize_score(value):
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return ''
    if isinstance(value, (int, float)):
        if pd.isna(value):
            return ''
        return str(int(value))
    text = str(value).strip()
    if text == 'nan' or text == '-':
        return ''
    return text


def format_datetime_value(date_value, time_value):
    if isinstance(date_value, datetime):
        dt = date_value
    elif isinstance(date_value, date) and isinstance(time_value, time):
        dt = datetime.combine(date_value, time_value)
    elif isinstance(date_value, date) and not isinstance(time_value, time):
        dt = datetime.combine(date_value, time(0, 0))
    elif isinstance(time_value, time) and not isinstance(date_value, date):
        dt = datetime.combine(datetime.today(), time_value)
    else:
        return str(date_value or time_value).strip() if date_value or time_value else ''
    return dt.strftime('%Y-%m-%d %H:%M:%S')


def parse_sheet(workbook_path: Path, sheet_name: str):
    df = pd.read_excel(workbook_path, sheet_name=sheet_name, header=None)
    rows = []
    for _, row in df.iterrows():
        team1 = normalize_text(row[5])
        team2 = normalize_text(row[13])
        sep = normalize_text(row[9])
        if not team1 or not team2 or sep != '-':
            continue

        raw_id = row[1] if not pd.isna(row[1]) else row[0]
        if pd.isna(raw_id):
            continue
        try:
            match_id = int(raw_id)
        except (TypeError, ValueError):
            continue

        goles1 = normalize_score(row[8])
        goles2 = normalize_score(row[10])
        fecha = format_datetime_value(row[2], row[3])
        ciudad = normalize_text(row[15])
        estadio = ''

        if sheet_name in GROUP_SHEETS:
            fase = f'Grupo {sheet_name}'
            tipo = 'grupos'
        else:
            fase = sheet_name
            tipo = KNOCKOUT_SHEETS.get(sheet_name, 'grupos')

        rows.append({
            'id': match_id,
            'fase': fase,
            'tipo': tipo,
            'fecha': fecha,
            'equipo1': team1,
            'equipo2': team2,
            'goles1': goles1,
            'goles2': goles2,
            'estadio': estadio,
            'ciudad': ciudad,
        })
    return rows


def main():
    if len(sys.argv) < 2:
        print('Uso: python import_fixtures.py archivo.xlsx')
        sys.exit(1)

    src = Path(sys.argv[1])
    if not src.exists():
        print(f'Archivo no encontrado: {src}')
        sys.exit(2)

    all_matches = []
    for sheet in GROUP_SHEETS:
        all_matches.extend(parse_sheet(src, sheet))

    for sheet in KNOCKOUT_SHEETS:
        all_matches.extend(parse_sheet(src, sheet))

    all_matches.sort(key=lambda x: x['id'])
    print(f'Partidos totales parseados: {len(all_matches)}')

    out_paths = []
    base_core = Path(__file__).resolve().parents[1]
    out_dir_core = base_core / 'static' / 'data'
    out_dir_core.mkdir(parents=True, exist_ok=True)
    out_paths.append(out_dir_core / 'partidos.json')

    base_web = Path(__file__).resolve().parents[2]
    out_dir_web = base_web / 'static' / 'data'
    out_dir_web.mkdir(parents=True, exist_ok=True)
    out_paths.append(out_dir_web / 'partidos.json')

    for out_file in out_paths:
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(all_matches, f, ensure_ascii=False, indent=2)
        print(f'Exportado {len(all_matches)} partidos a {out_file}')


if __name__ == '__main__':
    main()
