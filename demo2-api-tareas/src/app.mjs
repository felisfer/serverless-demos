import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

// INIT: se ejecuta una vez por entorno de ejecución
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.TABLE_NAME;
const json = (statusCode, data) => ({ statusCode, body: JSON.stringify(data) });

// INVOKE: se ejecuta en cada solicitud
export const handler = async (event) => {
  if (event.routeKey === "POST /tareas") {
    const tarea = { id: randomUUID(), ...JSON.parse(event.body) };
    await db.send(new PutCommand({ TableName: TABLE, Item: tarea }));
    return json(201, tarea);
  }
  // Scan sirve para la demo; en producción usa Query con un buen diseño de llaves
  const { Items } = await db.send(new ScanCommand({ TableName: TABLE }));
  return json(200, Items);
};
