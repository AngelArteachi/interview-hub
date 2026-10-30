"""Verifica los ejercicios de práctica ejecutando su código.

- predict: la salida real del código debe ser exactamente `answer`.
- complete: con la opción correcta en ____ el código debe correr; cada opción incorrecta
  debe fallar, colgarse o imprimir algo distinto (para que la pregunta tenga una sola respuesta).
- Los ids de ejercicio deben ser únicos.
- Los ejercicios de Python se ejecutan con Python y los de JavaScript con Node.

Uso (desde la raíz del proyecto):
    python -X utf8 scripts/check_exercises.py
"""
import shutil
import subprocess
import sys

from exercises_io import load_exercises


NODE = shutil.which('node')


def run(code, lang='python'):
    cmd = [NODE, '-e', code] if lang == 'javascript' else [sys.executable, '-I', '-X', 'utf8', '-c', code]
    p = subprocess.run(cmd, capture_output=True, text=True, encoding='utf8', timeout=5)
    if p.returncode != 0:
        raise RuntimeError((p.stderr.strip().splitlines() or ['error'])[-1])
    return p.stdout.strip()


def main():
    exercises = load_exercises()
    ids = [e['id'] for e in exercises]
    dupes = {i for i in ids if ids.count(i) > 1}
    fails = []
    checked = 0
    for ex in exercises:
        lang = ex.get('lang')
        if ex['kind'] not in ('predict', 'complete') or lang not in ('python', 'javascript'):
            continue
        checked += 1
        label = f"{ex['lesson']}/{ex['id']}"
        try:
            if ex['kind'] == 'predict':
                out = run(ex['code'], lang)
                if out != ex['answer']:
                    fails.append(f'{label}: imprime {out!r}, la respuesta dice {ex["answer"]!r}')
            else:
                good = run(ex['code'].replace('____', ex['options'][ex['answer']]), lang)
                for i, opt in enumerate(ex['options']):
                    if i == ex['answer']:
                        continue
                    try:
                        if run(ex['code'].replace('____', opt), lang) == good:
                            fails.append(f'{label}: la opción incorrecta {opt!r} da lo mismo que la correcta ({good!r})')
                    except (RuntimeError, subprocess.TimeoutExpired):
                        pass
        except (RuntimeError, subprocess.TimeoutExpired) as e:
            fails.append(f'{label}: error al ejecutar la versión correcta: {e}')
    print(f'ejercicios: {len(exercises)} | verificados ejecutando: {checked} | fallos: {len(fails) + len(dupes)}')
    for d in sorted(dupes):
        print(f'ID REPETIDO: {d}')
    for f in fails:
        print('FALLO', f)
    sys.exit(1 if fails or dupes else 0)


if __name__ == '__main__':
    main()
