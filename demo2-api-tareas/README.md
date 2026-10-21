# Demo 2 · API de tareas con AWS SAM

```
Cliente ──HTTPS──▶ API Gateway (HTTP API) ──event──▶ Lambda (TareasFunction) ──SDK v3──▶ DynamoDB (TareasTable)
```

Rutas: `GET /tareas` y `POST /tareas`.

## Estructura

```
demo2-api-tareas/
├── template.yaml      # infraestructura: tabla, función, rol IAM y rutas
└── src/
    ├── app.mjs        # handler
    └── package.json
```

## Desplegar

```bash
cd demo2-api-tareas
sam build
sam deploy --guided
```

Respuestas sugeridas para `--guided`:

| Pregunta | Respuesta |
|---|---|
| Stack Name | `tareas-api` |
| AWS Region | la que uses (ej. `us-east-1`) |
| Confirm changes before deploy | `y` |
| Allow SAM CLI IAM role creation | `y` |
| TareasFunction has no authentication. Is this okay? | `y` (solo para la demo) |
| Save arguments to configuration file | `y` |

Las siguientes veces basta con `sam build && sam deploy`.

## Probar

Copia el valor de `ApiUrl` de los Outputs:

```bash
API="https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com"

curl -X POST "$API/tareas" \
  -H "content-type: application/json" \
  -d '{"titulo":"Hola mundo"}'

curl "$API/tareas"
```

Ver los logs en vivo:

```bash
sam logs --stack-name tareas-api --tail
```

## Probar en local (usa Docker)

```bash
sam build
sam local start-api
curl http://127.0.0.1:3000/tareas
```

`sam local` ejecuta la función en un contenedor que imita a Lambda, pero **habla con la tabla real** de DynamoDB.
Pasa el nombre de la tabla con un archivo de variables:

```bash
echo '{"TareasFunction":{"TABLE_NAME":"<valor de TablaTareas>"}}' > env.json
sam local start-api --env-vars env.json
```

## Tener en cuenta

- `template.yaml` cumple el papel de `docker-compose.yml`, pero describe servicios administrados en lugar de contenedores.
- En la consola de CloudFormation se ve todo lo que se creó: tabla, función, rol IAM, HTTP API y permisos.
- `DynamoDBCrudPolicy` da acceso solo a esta tabla (mínimo privilegio).

## Limpieza

```bash
sam delete --stack-name tareas-api
```
