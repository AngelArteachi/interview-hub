"""Carga los ejercicios de la app (vía scripts/dump_exercises.mts) para los scripts de Python."""
import json
import os
import shutil
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_exercises():
    npx = shutil.which('npx') or shutil.which('npx.cmd')
    p = subprocess.run([npx, '--yes', 'tsx', 'scripts/dump_exercises.mts'], cwd=ROOT, capture_output=True, text=True, encoding='utf8', timeout=300)
    if p.returncode != 0:
        raise SystemExit('No pude leer los ejercicios:\n' + p.stderr)
    return json.loads(p.stdout)
