# Configurar cuentas y sincronización (Supabase + Google)

Con esto, cada persona inicia sesión con Google y su progreso se sincroniza entre dispositivos. Toma unos 15 minutos y todo cabe en los planes gratuitos.

## 1. Crear el proyecto en Supabase

1. Entra a https://supabase.com y crea un proyecto nuevo (elige una región cercana).
2. Ve a **SQL Editor → New query**, pega el contenido de [`supabase/schema.sql`](../supabase/schema.sql) y pulsa **Run**. Esto crea la tabla `user_data` con reglas para que cada usuario solo vea su propio progreso.
3. En **Project Settings → API Keys**, copia:
   - la **Project URL** (`https://xxxx.supabase.co`)
   - la **publishable key** (en proyectos antiguos se llama *anon key*). Es pública por diseño: la seguridad la dan las reglas RLS del paso anterior.

## 2. Crear las credenciales de Google

1. Entra a https://console.cloud.google.com, crea un proyecto y ve a **APIs & Services → OAuth consent screen**. Configúralo como *External* con el nombre de la app y tu correo.
2. En **Credentials → Create credentials → OAuth client ID** elige *Web application*.
3. En **Authorized redirect URIs** agrega la URL de callback que aparece en Supabase (**Authentication → Sign In / Providers → Google**). Tiene la forma `https://xxxx.supabase.co/auth/v1/callback`.
4. Copia el **Client ID** y el **Client secret**.

## 3. Activar Google en Supabase

1. En **Authentication → Sign In / Providers → Google**, actívalo y pega el Client ID y el Client secret.
2. En **Authentication → URL Configuration**:
   - **Site URL**: por ahora pon `http://localhost:5173`.
   - **Redirect URLs**: agrega `http://localhost:5173`.
3. **Cuando ya esté en Vercel**, vuelve aquí: cambia la **Site URL** a la URL de Vercel (p. ej. `https://interview-hub.vercel.app`) y agrégala también a **Redirect URLs**, sin borrar la de localhost.

## 4. Variables de entorno

En tu `.env` local y en Vercel (**Project Settings → Environment Variables**):

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
ANTHROPIC_API_KEY=sk-ant-...
AI_ALLOWED_EMAILS=tu.correo@gmail.com
```

- `AI_ALLOWED_EMAILS` es la lista de correos (separados por coma) que pueden usar la IA. Los demás usuarios pueden estudiar y sincronizar, pero sin IA, así nadie gasta tu API key.
- Después de cambiar variables en Vercel, haz un *Redeploy* para que se apliquen.

## Cómo funciona la sincronización

- **Sin sesión (invitado):** el progreso se guarda solo en el navegador, como siempre.
- **Al iniciar sesión:** se descarga tu progreso de la nube y se **combina** con el del navegador sin perder nada. En el repaso, por cada tarjeta gana la revisión más reciente; listas como tus historias o tarjetas propias se unen; la actividad diaria toma el máximo.
- **Mientras estudias:** cada cambio se sube unos segundos después. Si no hay internet, se guarda localmente y se sube al reconectar.
- **Al volver a la pestaña:** se traen los cambios que hayas hecho en otro dispositivo.
- **Al cerrar sesión:** se borra el progreso de ese navegador (sigue a salvo en tu cuenta). Es útil en computadoras compartidas.

> Nota: en el plan gratuito de Supabase, un proyecto sin actividad durante varios días puede pausarse. Se reactiva desde el panel de Supabase.
