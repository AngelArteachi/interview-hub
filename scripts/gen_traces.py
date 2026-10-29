"""Genera el "paso a paso" de los ejercicios ejecutando su código de verdad.

Para cada ejercicio de Python de tipo `predict` o `complete` (con la opción correcta),
ejecuta el código con sys.settrace y registra, línea por línea, qué se ejecutó,
cómo cambiaron las variables y una explicación en español e inglés.

Uso (desde la raíz del proyecto):
    python -I -X utf8 scripts/gen_traces.py

Escribe src/content/lessons/exercises/traces.json. Vuelve a ejecutarlo cada vez que
agregues o cambies el código de un ejercicio (la app ignora un paso a paso desactualizado).
"""
import glob
import io
import json
import re
import sys
from contextlib import redirect_stdout

ROOT = '.'
OUT = 'src/content/lessons/exercises/traces.json'
MAX_STEPS = 90
FILENAME = '<ejercicio>'


def ts_string(s):
    return s.encode('utf8').decode('unicode_escape').encode('latin1').decode('utf8')


def fmt(v):
    r = repr(v)
    return r if len(r) <= 40 else r[:37] + '...'


def user_vars(frame, module_globals):
    """Variables del usuario: las del módulo y, si estamos en una función, sus locales."""
    out = {}
    for k, v in module_globals.items():
        if k.startswith('__') or callable(v) or type(v).__name__ == 'module':
            continue
        out[k] = fmt(v)
    if frame.f_code.co_name != '<module>':
        for k, v in frame.f_locals.items():
            if not callable(v):
                out[k] = fmt(v)
    return out


def cond_of(line):
    m = re.match(r'\s*(if|elif|while)\s+(.*):\s*(#.*)?$', line)
    return (m.group(1), m.group(2).strip()) if m else (None, None)


def describe(src_line, kind_cond, cond_val, before, after):
    """Explicación (es, en) de lo que hizo una línea."""
    s = src_line.strip()
    changed = [k for k in after if before.get(k) != after[k]]
    created = [k for k in changed if k not in before]
    updated = [k for k in changed if k in before]
    kw, expr = kind_cond
    if kw in ('if', 'elif'):
        if cond_val:
            return (f'Comprueba `{expr}`: es **verdadero**, así que entra al bloque.', f'Checks `{expr}`: it is **true**, so it enters the block.')
        return (f'Comprueba `{expr}`: es **falso**, así que se salta el bloque.', f'Checks `{expr}`: it is **false**, so it skips the block.')
    if kw == 'while':
        if cond_val:
            return (f'Condición del while `{expr}`: **verdadera**, da otra vuelta.', f'While condition `{expr}`: **true**, it runs another iteration.')
        return (f'Condición del while `{expr}`: **falsa**, sale del ciclo.', f'While condition `{expr}`: **false**, it leaves the loop.')
    m = re.match(r'for\s+(\w+)', s)
    if m:
        var = m.group(1)
        if var in changed:
            return (f'Siguiente vuelta del ciclo: `{var}` = {after[var]}.', f'Next loop iteration: `{var}` = {after[var]}.')
        return (f'Ya no quedan valores: termina el ciclo `for {var}`.', f'No values left: the `for {var}` loop ends.')
    if s.startswith('def '):
        name = re.match(r'def\s+(\w+)', s).group(1)
        return (f'Define la función `{name}` (todavía no la ejecuta).', f'Defines the function `{name}` (it does not run it yet).')
    if s.startswith('print('):
        return ('Imprime algo en pantalla (lo verás al comprobar tu respuesta).', 'Prints something (you will see it when you check your answer).')
    if s.startswith('return'):
        return ('Devuelve el resultado.', 'Returns the result.')
    if s.startswith('global'):
        return ('Indica que va a usar la variable global.', 'Declares it will use the global variable.')
    parts_es, parts_en = [], []
    for k in created:
        parts_es.append(f'crea `{k}` = {after[k]}')
        parts_en.append(f'creates `{k}` = {after[k]}')
    for k in updated:
        parts_es.append(f'`{k}` cambia de {before[k]} a {after[k]}')
        parts_en.append(f'`{k}` changes from {before[k]} to {after[k]}')
    if parts_es:
        return ('Ejecuta la línea: ' + '; '.join(parts_es) + '.', 'Runs the line: ' + '; '.join(parts_en) + '.')
    stmt = s.split('#')[0].strip()
    return (f'Ejecuta `{stmt}`.', f'Runs `{stmt}`.')


def trace(code):
    lines = code.split('\n')
    steps = []
    pending = {}
    g = {'__name__': '__main__'}
    depth = [0]

    def finalize(frame):
        if not pending:
            return
        after = user_vars(frame if pending['frame'] is None else pending['frame'], g)
        if pending['frame'] is not None and pending['frame'].f_code.co_name != '<module>':
            after = user_vars(pending['frame'], g)
        es, en = describe(lines[pending['line'] - 1], pending['cond'], pending['cond_val'], pending['before'], after)
        steps.append({
            'line': pending['line'],
            'depth': pending['depth'],
            'fn': pending['fn'],
            'vars': after,
            'changed': [k for k in after if pending['before'].get(k) != after[k]],
            'text': {'es': es, 'en': en},
        })
        pending.clear()

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != FILENAME:
            return tracer
        if len(steps) >= MAX_STEPS:
            return None
        if event == 'call':
            finalize(frame)
            if frame.f_code.co_name != '<module>':
                depth[0] += 1
                args = ', '.join(f'{k}={fmt(frame.f_locals[k])}' for k in frame.f_code.co_varnames[: frame.f_code.co_argcount])
                fn = frame.f_code.co_name
                steps.append({
                    'line': frame.f_lineno,
                    'depth': depth[0],
                    'fn': fn,
                    'vars': user_vars(frame, g),
                    'changed': [],
                    'text': {'es': f'Llama a `{fn}({args})`.', 'en': f'Calls `{fn}({args})`.'},
                })
            return tracer
        if event == 'line':
            finalize(frame)
            kw, expr = cond_of(lines[frame.f_lineno - 1])
            val = None
            if kw:
                try:
                    val = bool(eval(expr, g, dict(frame.f_locals)))
                except Exception:
                    kw = None
            pending.update({
                'line': frame.f_lineno, 'frame': frame, 'before': user_vars(frame, g), 'cond': (kw, expr),
                'cond_val': val, 'depth': depth[0], 'fn': None if frame.f_code.co_name == '<module>' else frame.f_code.co_name,
            })
            return tracer
        if event == 'return':
            finalize(frame)
            if frame.f_code.co_name != '<module>':
                fn = frame.f_code.co_name
                steps.append({
                    'line': frame.f_lineno,
                    'depth': depth[0],
                    'fn': fn,
                    'vars': user_vars(frame, g),
                    'changed': [],
                    'text': {'es': f'`{fn}` termina y devuelve {fmt(arg)}.', 'en': f'`{fn}` finishes and returns {fmt(arg)}.'},
                })
                depth[0] -= 1
            return tracer
        return tracer

    compiled = compile(code, FILENAME, 'exec')
    buf = io.StringIO()
    sys.settrace(tracer)
    try:
        with redirect_stdout(buf):
            exec(compiled, g)
    finally:
        sys.settrace(None)
    truncated = len(steps) >= MAX_STEPS
    return steps, buf.getvalue().strip(), truncated


def main():
    traces = {}
    for f in sorted(glob.glob(ROOT + '/src/content/lessons/**/*.ts', recursive=True)):
        src = open(f, encoding='utf8').read()
        for m in re.finditer(r"id: '([\w-]+)',\s*level: '\w+',\s*kind: '(predict|complete)',(.*?)explanation:", src, re.S):
            exid, kind, body = m.groups()
            if re.search(r"lang: '(\w+)'", body).group(1) != 'python':
                continue
            code = re.search(r"code: `(.*?)`,", body, re.S).group(1).replace('\\`', '`').replace('\\\\', '\\')
            run_code = code
            if kind == 'complete':
                opts = [ts_string(o) for o in re.findall(r"'((?:[^'\\]|\\.)*)'", re.search(r"options: \[(.*?)\],", body, re.S).group(1))]
                ans = int(re.search(r"answer: (\d+)", body).group(1))
                run_code = code.replace('____', opts[ans])
            assert exid not in traces, f'id de ejercicio repetido: {exid}'
            steps, out, truncated = trace(run_code)
            traces[exid] = {'code': code, 'kind': kind, 'steps': steps, 'truncated': truncated}
            print(f'{exid:16} {len(steps):3} pasos' + ('  (recortado)' if truncated else ''))
    with open(OUT, 'w', encoding='utf8') as fh:
        json.dump(traces, fh, ensure_ascii=False, indent=1)
    print(f'\n{len(traces)} ejercicios -> {OUT}')


if __name__ == '__main__':
    main()
