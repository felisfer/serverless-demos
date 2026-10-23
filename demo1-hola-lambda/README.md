# Demo 1 · Hola, Lambda (consola)

## Pasos

1. En la consola de Lambda: **Create function → Author from scratch**.
   - Nombre: `hola-lambda`
   - Runtime: **Node.js 24.x**
   - Arquitectura: x86_64 o arm64 (cualquiera)
2. En el editor, reemplaza el contenido de `index.mjs` por el de este directorio y presiona **Deploy**.
3. Pestaña **Test** → crea un evento con el contenido de [`evento-prueba.json`](evento-prueba.json) → **Test**.
4. **Configuration → Function URL → Create function URL** con *Auth type* = `NONE`.
5. Llámala desde la terminal:

   ```bash
   URL="https://xxxxxxxx.lambda-url.us-east-1.on.aws"   # copia la tuya
   curl "$URL?nombre=Fernando"
   # {"saludo":"Hola, Fernando"}
   ```

   En PowerShell (Windows):

   ```powershell
   $URL = "https://xxxxxxxx.lambda-url.us-east-1.on.aws"   # copia la tuya
   curl.exe "${URL}?nombre=Fernando"
   # o bien:
   Invoke-RestMethod "${URL}?nombre=Fernando"
   ```

6. **Monitor → View CloudWatch logs** y abre el log stream más reciente.

## Tener en cuenta

- Cada invocación deja tres líneas: `START`, `END` y `REPORT`.
- La primera llamada tras el despliegue incluye `Init Duration` en `REPORT` (cold start); las siguientes no.
- `Billed Duration` incluye el INIT en un cold start.
- Sube la memoria de 128 MB a 1024 MB (**Configuration → General configuration**) y compara `Duration`.

## Limpieza

La Function URL con `NONE` es pública: bórrala al terminar (**Configuration → Function URL → Delete**) o elimina la función completa.
