#!/usr/bin/env python3
import sys
from pathlib import Path
import pandas as pd

def inspect(path):
    p = Path(path)
    if not p.exists():
        print('NO_ENCONTRADO', path)
        return
    xl = pd.ExcelFile(p)
    print('Hojas:', xl.sheet_names)
    for s in xl.sheet_names:
        print('\n--- Hoja:', s)
        try:
            df = pd.read_excel(xl, sheet_name=s)
            print(df.head(10).to_string(index=False))
        except Exception as e:
            print('Error leyendo hoja', s, e)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Uso: inspect_excel.py archivo.xlsx')
        sys.exit(1)
    inspect(sys.argv[1])
