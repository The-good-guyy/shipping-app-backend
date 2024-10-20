import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { AWS_PREFIX } from '../common/constants';
@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  async upload(fileName: string, file: Buffer) {
    const newfileName = 'profileImg/' + fileName;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'profilenest',
        Key: newfileName,
        Body: file,
      }),
    );
    return AWS_PREFIX + newfileName;
  }
}
