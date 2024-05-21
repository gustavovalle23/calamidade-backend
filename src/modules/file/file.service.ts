import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { FileEntity } from "./entities/file.entity";
import { Repository } from "typeorm";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { AllConfigType } from "src/config/config.type";
import { CreateFileDto } from "./dto/create-file.dto";
import path from "path";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mime from "mime-types";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { NullableType } from "src/utils/types/nullable.type";
import { ResourceNotFoundException } from "src/infrastructure/exceptions/resource-not-found.exception";

@Injectable()
export class FileService {
  private s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {
    this.s3Client = new S3Client({
      endpoint: this.configService.getOrThrow("file.r2Endpoint", { infer: true }),
      region: this.configService.getOrThrow("file.r2Region", { infer: true }),
      credentials: {
        accessKeyId: this.configService.getOrThrow("file.r2AccessKeyId", { infer: true }),
        secretAccessKey: this.configService.getOrThrow("file.r2SecretAccessKey", { infer: true }),
      },
    });
  }

  create(createFile: CreateFileDto): Promise<FileEntity> {
    return this.fileRepository.save(this.fileRepository.create(createFile));
  }

  async generatePresignedUrl(fileName: string, folder?: string): Promise<any> {
    const fileExtension = path.extname(fileName); // Extrai a extensão do arquivo
    const mimeType = mime.lookup(fileExtension); // Obtém o mimeType a partir da extensão do arquivo
    if (!mimeType) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errors: {
            message: "Invalid file extension",
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const FileName = `${Date.now()}-${path.basename(fileName, fileExtension)}${fileExtension}`; // Gera um nome de arquivo único incluindo a extensão

    const bucket = this.configService.get("file.r2Bucket", { infer: true });
    const key = folder ? `${folder}/${FileName}` : FileName;

    // Validação de nome de pasta
    const allowedFolders = ["receipts", "accidents"];
    if (folder && !allowedFolders.includes(folder)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errors: {
            folder: "Invalid folder name. Allowed folders are receipts and accidents",
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!bucket) {
      return { status: "error", error: "Bucket was not informed" };
    }

    const file = await this.create({
      bucket: bucket,
      key: key,
    });

    console.log(file);
    const fileId = file.id;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: mimeType,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      }); // URL expira em 1 hora
      return { url, key, fileId };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          errors: {
            message: "Failed to generate presigned URL",
            detail: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPresignedUrl(id: string) {
    const file = await this.fileRepository.findOne({
      where: { id: id },
    });

    console.log(file);

    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: "selectFile",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const command = new GetObjectCommand({
      Bucket: file.bucket,
      Key: file.key,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      }); // URL expira em 1 hora
      return { url };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          errors: {
            message: "Failed to generate presigned URL",
            detail: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(fields: EntityCondition<FileEntity>): Promise<NullableType<FileEntity>> {
    const file = await this.fileRepository.findOne({
      where: fields,
    });

    if (!file) {
      throw new ResourceNotFoundException();
    }

    return file;
  }
}
