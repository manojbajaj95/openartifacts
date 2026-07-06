import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!client) {
    const endpoint = process.env.OA_S3_ENDPOINT;
    client = new S3Client({
      region: process.env.OA_S3_REGION ?? "us-east-1",
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: requireEnv("OA_S3_ACCESS_KEY"),
        secretAccessKey: requireEnv("OA_S3_SECRET_KEY"),
      },
    });
  }
  return client;
}

function bucket(): string {
  return requireEnv("OA_S3_BUCKET");
}

export function artifactKey(id: string): string {
  return `artifacts/${id}`;
}

export async function putObject(key: string, body: Buffer, contentType: string): Promise<void> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

export async function presignGet(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(
    getClient(),
    new GetObjectCommand({ Bucket: bucket(), Key: key }),
    { expiresIn },
  );
}

export async function getObject(key: string): Promise<{ body: Buffer; contentType: string }> {
  const out = await getClient().send(
    new GetObjectCommand({ Bucket: bucket(), Key: key }),
  );
  const bytes = await out.Body?.transformToByteArray();
  if (!bytes) throw new Error("Empty object body");
  return {
    body: Buffer.from(bytes),
    contentType: out.ContentType ?? "application/octet-stream",
  };
}
