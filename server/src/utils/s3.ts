import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3_BUCKET_NAME, s3Client } from "../config/aws";
import logger from "./logger";

export const uploadFileToS3 = async (
  file: Express.Multer.File,
  userId: string
): Promise<string> => {
  const key = `uploads/${userId}/${file.originalname}`;

  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return key;
  } catch (error) {
    logger.error({ message: "Error uploading to S3", error });
    throw new Error("Failed to upload file to S3");
  }
};

export const getSignedFileUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
  });

  try {
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    logger.error({ message: "Error generating signed URL", error });
    throw new Error("Failed to generate signed URL");
  }
};

export const deleteFileFromS3 = async (userId: string, fileName: string): Promise<void> => {
  const fullPath = `uploads/${userId}/${fileName}`;
  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fullPath,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    logger.error({ message: "Error deleting file from S3", error });
    throw new Error("Failed to delete file from S3");
  }
};
