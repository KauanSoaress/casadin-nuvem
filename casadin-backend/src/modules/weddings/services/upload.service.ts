import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomBytes } from "crypto";
import { Client as MinioClient } from "minio";
import { extname } from "path";

@Injectable()
export class UploadService {
  private readonly bucket: string;
  private readonly minio: MinioClient;
  private readonly endpoint: string;
  private readonly port: number;
  private readonly useSSL: boolean;
  private readonly region?: string;
  private readonly publicUrl?: string;

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get<string>("MINIO_ENDPOINT", "localhost");
    this.port = Number(this.configService.get("MINIO_PORT", 9000));
    this.useSSL = this.configService.get<string>("MINIO_USE_SSL", "false") === "true";
    this.bucket = this.configService.get<string>("MINIO_BUCKET", "uploads");
    this.region = this.configService.get<string>("MINIO_REGION");
    this.publicUrl = this.configService.get<string>("MINIO_PUBLIC_URL");

    this.minio = new MinioClient({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: this.useSSL,
      accessKey: this.configService.get<string>("MINIO_ACCESS_KEY", ""),
      secretKey: this.configService.get<string>("MINIO_SECRET_KEY", ""),
    });
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      const exists = await this.minio.bucketExists(this.bucket);
      if (!exists) {
        await this.minio.makeBucket(this.bucket, this.region);
      }
    } catch (error) {
      // Se o bucket já existe, ignorar o erro
      if (!error.message.includes("already own it")) {
        throw error;
      }
    }
  }

  private buildObjectName(folder: string, originalName: string): string {
    const sanitizedFolder = folder.replace(/^\/+|\/+$/g, "");
    const extension = extname(originalName) || "";
    const fileId = `${Date.now()}-${randomBytes(8).toString("hex")}`;
    return `${sanitizedFolder}/${fileId}${extension}`;
  }

  private buildFileUrl(objectName: string): string {
    // Verificar se está em desenvolvimento com Docker
    const isDocker = this.endpoint === 'minio';
    
    if (this.publicUrl && !isDocker) {
      return `${this.publicUrl}/${this.bucket}/${objectName}`;
    }

    // Em desenvolvimento com Docker, usar localhost para acesso do navegador
    const protocol = this.useSSL ? "https" : "http";
    const host = isDocker ? "localhost" : this.endpoint;
    return `${protocol}://${host}:${this.port}/${this.bucket}/${objectName}`;
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = "weddings",
  ): Promise<string> {
    try {
      await this.ensureBucketExists();
      const objectName = this.buildObjectName(folder, file.originalname);

      await this.minio.putObject(this.bucket, objectName, file.buffer, file.size, {
        "Content-Type": file.mimetype,
      });

      return this.buildFileUrl(objectName);
    } catch (error) {
      throw new Error(`Erro no upload da imagem: ${error.message}`);
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: string = "weddings",
  ): Promise<string[]> {
    try {
      // Garantir que o bucket existe apenas uma vez
      await this.ensureBucketExists();
      
      const uploadPromises = files.map((file) =>
        this.uploadImageInternal(file, folder),
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new Error(`Erro no upload das imagens: ${error.message}`);
    }
  }

  private async uploadImageInternal(
    file: Express.Multer.File,
    folder: string = "weddings",
  ): Promise<string> {
    try {
      const objectName = this.buildObjectName(folder, file.originalname);

      await this.minio.putObject(this.bucket, objectName, file.buffer, file.size, {
        "Content-Type": file.mimetype,
      });

      return this.buildFileUrl(objectName);
    } catch (error) {
      throw new Error(`Erro no upload da imagem: ${error.message}`);
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      const objectName = this.extractPublicId(publicId);
      if (!objectName) {
        return;
      }

      await this.ensureBucketExists();
      await this.minio.removeObject(this.bucket, objectName);
    } catch (error) {
      console.error(`Erro ao deletar imagem: ${error.message}`);
    }
  }

  extractPublicId(url: string): string | null {
    const bucketSegment = `/${this.bucket}/`;
    const index = url.indexOf(bucketSegment);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(url.slice(index + bucketSegment.length));
  }
}
