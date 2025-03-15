import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { env } from "./env";

dotenv.config();

const AWS_REGION = env.AWS_REGION;
const AWS_ACCESS_KEY_ID = env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = env.AWS_SECRET_ACCESS_KEY;

export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const S3_BUCKET_NAME = env.S3_BUCKET_NAME;
