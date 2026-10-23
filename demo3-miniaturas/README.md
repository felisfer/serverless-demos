# Demo 3 · Miniaturas al subir a S3

```
Usuario ──PUT──▶ S3 (originales) ──ObjectCreated──▶ Lambda (sharp, 200 px) ──PUT──▶ S3 (miniaturas)
```

## Estructura

```
demo3-miniaturas/
├── template.yaml             # buckets, función, permisos y evento de S3
├── src/
│   ├── miniatura.mjs         # handler
│   └── package.json
├── subir-fotos.sh            # sube una carpeta completa para provocar concurrencia (bash)
├── subir-fotos.ps1           # lo mismo, para PowerShell
└── consulta-cold-starts.txt  # consulta de CloudWatch Logs Insights
```

## Configurar AWS CLI
Es necesario iniciar sesion con una cuenta de AWS.

```bash
aws login # seguir las instrucciones en la pantalla
aws configure set region us-east-2 # o tu region
```

## Desplegar

`sharp` incluye binarios nativos. Si se instala en Windows o macOS y se sube tal cual, falla en Lambda. Por eso se compila **dentro de un contenedor** que imita el entorno de Lambda (necesita Docker):

```bash
cd demo3-miniaturas
sam build --use-container
sam deploy --guided --stack-name miniaturas-demo
```

El nombre del stack debe ir **en minúsculas**, porque forma parte del nombre de los buckets.

## Probar

```bash
CUENTA=$(aws sts get-caller-identity --query Account --output text)

# 1) Una foto: cold start
aws s3 cp foto.jpg s3://miniaturas-demo-originales-$CUENTA/

# 2) Otra foto: entorno caliente, sin Init Duration
aws s3 cp otra.jpg s3://miniaturas-demo-originales-$CUENTA/

# Ver el resultado
aws s3 ls s3://miniaturas-demo-miniaturas-$CUENTA/

# 3) Muchas a la vez: varios entornos en paralelo
mkdir -p fotos   # coloca aquí unas 20 imágenes .jpg o .png
chmod +x subir-fotos.sh
./subir-fotos.sh miniaturas-demo ./fotos

# Logs en vivo
sam logs --stack-name miniaturas-demo --tail
```

En PowerShell (Windows):

```powershell
$CUENTA = aws sts get-caller-identity --query Account --output text

# 1) Una foto: cold start
aws s3 cp foto.jpg "s3://miniaturas-demo-originales-$CUENTA/"

# 2) Otra foto: entorno caliente, sin Init Duration
aws s3 cp otra.jpg "s3://miniaturas-demo-originales-$CUENTA/"

# Ver el resultado
aws s3 ls "s3://miniaturas-demo-miniaturas-$CUENTA/"

# 3) Muchas a la vez: varios entornos en paralelo
New-Item -ItemType Directory -Force fotos | Out-Null   # coloca aquí unas 20 imágenes .jpg o .png
.\subir-fotos.ps1 miniaturas-demo .\fotos

# Logs en vivo
sam logs --stack-name miniaturas-demo --tail
```

Si PowerShell bloquea el script, habilita la ejecución solo para esta sesión con `Set-ExecutionPolicy -Scope Process Bypass`.

Para contar cold starts, abre **CloudWatch → Logs Insights**, elige el grupo `/aws/lambda/<NombreFuncion>` y pega la consulta de `consulta-cold-starts.txt`. La métrica `ConcurrentExecutions` de la función tarda uno o dos minutos en aparecer.

## Tomar en cuenta

- El evento de S3 trae una lista `Records`. La llave llega codificada para URL.
- Las miniaturas se escriben en **otro** bucket. Si fuera el mismo, cada miniatura volvería a disparar la función.
- Las líneas `REPORT` con `Init Duration` corresponden a entornos nuevos.
- Al duplicar la memoria baja la duración, porque Lambda asigna más CPU.

## Limpieza

CloudFormation no puede borrar buckets con objetos. Vacíalos primero:

```bash
CUENTA=$(aws sts get-caller-identity --query Account --output text)
aws s3 rm s3://miniaturas-demo-originales-$CUENTA --recursive
aws s3 rm s3://miniaturas-demo-miniaturas-$CUENTA --recursive
sam delete --stack-name miniaturas-demo
```

En PowerShell:

```powershell
$CUENTA = aws sts get-caller-identity --query Account --output text
aws s3 rm "s3://miniaturas-demo-originales-$CUENTA" --recursive
aws s3 rm "s3://miniaturas-demo-miniaturas-$CUENTA" --recursive
sam delete --stack-name miniaturas-demo
```
