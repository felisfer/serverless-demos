# Demos de computación serverless con AWS Lambda

Código de las tres demos. Todo usa **Node.js 24** (`nodejs24.x`) y el AWS SDK para JavaScript v3.

| Demo | Qué muestra | Herramienta |
|---|---|---|
| [`demo1-hola-lambda`](demo1-hola-lambda/) | Modelo handler / event / context, Function URL, logs | Consola de AWS |
| [`demo2-api-tareas`](demo2-api-tareas/) | API Gateway + Lambda + DynamoDB como código | AWS SAM |
| [`demo3-miniaturas`](demo3-miniaturas/) | Evento de S3, cold starts y concurrencia | AWS SAM + Docker |

## Requisitos

- Cuenta de AWS con un usuario o rol con permisos para Lambda, API Gateway, DynamoDB, S3, IAM y CloudFormation
- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configurada (`aws configure`)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- Node.js 24 y npm
- Docker en ejecución (para `sam local` y para compilar `sharp` en la demo 3)

Comprueba todo con:

```bash
aws sts get-caller-identity
sam --version
node --version
docker info --format '{{.ServerVersion}}'
```

## Al terminar

Cada demo indica cómo borrar sus recursos. Lo más importante: **vaciar los buckets de la demo 3 antes de `sam delete`** y borrar la Function URL de la demo 1, que es pública.
