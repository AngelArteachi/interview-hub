"""Genera el "paso a paso" de los ejercicios ejecutando su código de verdad.

Para cada ejercicio de Python de tipo `predict` o `complete` (con la opción correcta),
ejecuta el código con sys.settrace y registra, línea por línea, qué se ejecutó,
cómo cambiaron las variables y una explicación en español e inglés.

Uso (desde la raíz del proyecto):
    python -X utf8 scripts/gen_traces.py

Escribe src/content/lessons/exercises/traces.json. Vuelve a ejecutarlo cada vez que
agregues o cambies el código de un ejercicio (la app ignora un paso a paso desactualizado).
"""
import inspect
import io
import json
import re
import sys
from collections import deque
from contextlib import redirect_stdout

from exercises_io import load_exercises

OUT = 'src/content/lessons/exercises/traces.json'
MAX_STEPS = 90
FILENAME = '<ejercicio>'


def fmt(v, depth=0):
    # Funciones guardadas en variables o listas: su nombre, no una dirección de memoria
    if callable(v) and not isinstance(v, type):
        name = getattr(v, '__name__', 'función')
        return 'lambda' if name == '<lambda>' else name
    # Objetos (Nodo, Cuenta…): mostrar "Nodo(3)" con su primer atributo, en vez de una dirección de memoria
    if hasattr(v, '__dict__') and type(v).__module__ == '__main__':
        if depth >= 2:
            return f'{type(v).__name__}(…)'
        attrs = list(vars(v).values())
        # Un Nodo enlaza a otros nodos: basta su valor. Otros objetos muestran todos sus datos.
        if type(v).__name__ == 'Nodo':
            attrs = attrs[:1]
        inner = ', '.join(fmt(a, depth + 1) for a in attrs)
        return f'{type(v).__name__}({inner})'
    if isinstance(v, (list, tuple, deque)) and any(hasattr(x, '__dict__') or callable(x) for x in v):
        r = '[' + ', '.join(fmt(x, depth + 1) for x in v) + ']'
        if isinstance(v, deque):
            r = f'deque({r})'
    elif isinstance(v, (set, frozenset)) and v:
        # Ordenado para que el paso a paso salga igual en cada ejecución
        r = '{' + ', '.join(sorted(repr(x) for x in v)) + '}'
    else:
        r = repr(v)
    return r if len(r) <= 40 else r[:37] + '...'


def user_vars(frame, module_globals):
    """Variables del usuario: las del módulo y, si estamos en una función, sus locales."""
    out = {}
    for k, v in module_globals.items():
        if k.startswith('__') or callable(v) or type(v).__name__ == 'module' or isinstance(v, type):
            continue
        out[k] = fmt(v)
    if frame.f_code.co_name != '<module>':
        for k, v in frame.f_locals.items():
            # Se muestran las funciones recibidas como dato (p. ej. `fn` en Observer), no las definidas con def adentro
            if isinstance(v, type) or (callable(v) and getattr(v, '__name__', None) == k):
                continue
            out[k] = fmt(v)
    return out


def cond_of(line):
    m = re.match(r'\s*(if|elif|while)\s+(.*):\s*(#.*)?$', line)
    return (m.group(1), m.group(2).strip()) if m else (None, None)


def describe(src_line, kind_cond, cond_val, before, after, enters_body=None):
    """Explicación (es, en) de lo que hizo una línea.

    enters_body: para un `for`, si la siguiente línea ejecutada está dentro del ciclo (None si no se sabe)."""
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
        if enters_body is None:
            enters_body = var in changed
        if enters_body and var in after:
            return (f'Siguiente vuelta del ciclo: `{var}` = {after[var]}.', f'Next loop iteration: `{var}` = {after[var]}.')
        if enters_body:
            return ('Siguiente vuelta del ciclo.', 'Next loop iteration.')
        return (f'Ya no quedan valores: termina el ciclo `for {var}`.', f'No values left: the `for {var}` loop ends.')
    if s.startswith('def '):
        name = re.match(r'def\s+(\w+)', s).group(1)
        return (f'Define la función `{name}` (todavía no la ejecuta).', f'Defines the function `{name}` (it does not run it yet).')
    if s.startswith('class '):
        name = re.match(r'class\s+(\w+)', s).group(1)
        return (f'Define la clase `{name}`: cada `{name}(...)` crea un objeto nuevo.', f'Defines the class `{name}`: each `{name}(...)` creates a new object.')
    if s.startswith('print('):
        return ('Imprime algo en pantalla (lo verás al comprobar tu respuesta).', 'Prints something (you will see it when you check your answer).')
    if s.startswith('try:'):
        return ('Entra al bloque `try`: si algo falla adentro, salta al `except`.', 'Enters the `try` block: if something fails inside, it jumps to the `except`.')
    if s.startswith('except'):
        return ('Hubo un error de ese tipo: lo captura y entra al bloque `except`.', 'An error of that type happened: it is caught and the `except` block runs.')
    if s.startswith('raise'):
        return ('Lanza la excepción: la función se detiene aquí.', 'Raises the exception: the function stops here.')
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
    raising = {}   # frame -> nombre de la excepción que lo está interrumpiendo

    def indent(n):
        return len(lines[n - 1]) - len(lines[n - 1].lstrip())

    def finalize(frame, next_line=None):
        if not pending:
            return
        # ¿La siguiente línea de este mismo frame está dentro del cuerpo del for?
        enters = None
        if next_line is not None and frame is pending['frame']:
            enters = next_line > pending['line'] and indent(next_line) > indent(pending['line'])
        elif next_line is None and frame is pending['frame']:
            enters = False   # el frame terminó justo después del for
        after = user_vars(frame if pending['frame'] is None else pending['frame'], g)
        if pending['frame'] is not None and pending['frame'].f_code.co_name != '<module>':
            after = user_vars(pending['frame'], g)
        es, en = describe(lines[pending['line'] - 1], pending['cond'], pending['cond_val'], pending['before'], after, enters)
        exc = raising.get(pending['frame'])
        if exc and not lines[pending['line'] - 1].strip().startswith('raise'):
            es, en = f'Esta línea lanza `{exc}`.', f'This line raises `{exc}`.'
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
            # No entrar al cuerpo de una clase ni a su __init__ (crear un Nodo no es parte del algoritmo)
            is_class_body = frame.f_code.co_name != '<module>' and not (frame.f_code.co_flags & inspect.CO_OPTIMIZED)
            if frame.f_code.co_name == '__init__' or is_class_body:
                return None
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
        if event == 'exception':
            raising[frame] = arg[0].__name__
            return tracer
        if event == 'line':
            finalize(frame, frame.f_lineno)
            raising.pop(frame, None)   # la excepción se capturó en este mismo frame
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
                    'text': (
                        {'es': f'`{fn}` se interrumpe por la excepción `{raising[frame]}`.', 'en': f'`{fn}` is interrupted by the `{raising[frame]}` exception.'}
                        if frame in raising else
                        {'es': f'`{fn}` termina y devuelve {fmt(arg)}.', 'en': f'`{fn}` finishes and returns {fmt(arg)}.'}
                    ),
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
    for ex in load_exercises():
        if ex['kind'] not in ('predict', 'complete') or ex.get('lang') != 'python':
            continue
        assert ex['id'] not in traces, f"id de ejercicio repetido: {ex['id']}"
        run_code = ex['code'] if ex['kind'] == 'predict' else ex['code'].replace('____', ex['options'][ex['answer']])
        steps, _out, truncated = trace(run_code)
        traces[ex['id']] = {'code': ex['code'], 'kind': ex['kind'], 'steps': steps, 'truncated': truncated}
        print(f"{ex['lesson']:>20}/{ex['id']:<16} {len(steps):3} pasos" + ('  (recortado)' if truncated else ''))
    with open(OUT, 'w', encoding='utf8') as fh:
        json.dump(traces, fh, ensure_ascii=False, indent=1)
    print(f'\n{len(traces)} ejercicios -> {OUT}')


if __name__ == '__main__':
    main()
