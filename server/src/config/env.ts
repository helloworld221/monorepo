import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string().valid("development", "production", "test").required(),
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  S3_BUCKET_NAME: Joi.string().required(),
  SESSION_SECRET: Joi.string().required(),
  CLIENT_URL: Joi.string().uri().required(),
  MONGODB_URI: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
  RENDER: Joi.string().required(),
}).unknown();

const { value: envVars, error } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,
  AWS_REGION: envVars.AWS_REGION,
  AWS_ACCESS_KEY_ID: envVars.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: envVars.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME: envVars.S3_BUCKET_NAME,
  SESSION_SECRET: envVars.SESSION_SECRET,
  CLIENT_URL: envVars.CLIENT_URL,
  MONGODB_URI: envVars.MONGODB_URI,
  GOOGLE_CLIENT_ID: envVars.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: envVars.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: envVars.GOOGLE_CALLBACK_URL,
  RENDER: envVars.RENDER,
};
