import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

// INIT: el cliente se crea una vez por entorno
const s3 = new S3Client({});

export const handler = async (event) => {
  // Un evento de S3 puede traer varios objetos
  for (const record of event.Records) {
    const Bucket = record.s3.bucket.name;
    // La llave llega codificada para URL (los espacios vienen como "+")
    const Key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    const original = await s3.send(new GetObjectCommand({ Bucket, Key }));
    const bytes = await original.Body.transformToByteArray();
    const thumb = await sharp(bytes).resize({ width: 200 }).jpeg().toBuffer();

    await s3.send(new PutObjectCommand({
      Bucket: process.env.DEST_BUCKET, Key, Body: thumb, ContentType: "image/jpeg",
    }));
    console.log(`miniatura creada: ${Key} (${thumb.length} bytes)`);
  }
};
