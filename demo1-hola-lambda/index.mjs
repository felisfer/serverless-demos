// index.mjs · runtime nodejs24.x
export const handler = async (event, context) => {
  console.log("request:", context.awsRequestId);
  const nombre = event.queryStringParameters?.nombre ?? "mundo";

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ saludo: `Hola, ${nombre}` }),
  };
};
