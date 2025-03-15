import "express";
import "multer";

declare module "express-serve-static-core" {
  interface Request {
    user: any;
    session: any;
    isAuthenticated(): boolean;
    logout(callback?: (err?: any) => void): void;
    file?: any;
    files?: { [fieldname: string]: any[] };
  }
}

declare module "multer" {
  interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  }
}
