import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class UploadsService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicDomain: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('R2_ENDPOINT');
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID') || 'test-key';
    const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY') || 'test-secret';
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME') || 'loopin-media';
    this.publicDomain = this.configService.get<string>('R2_PUBLIC_DOMAIN') || 'https://cdn.loopin.codapi.site';

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: endpoint || undefined,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async getPresignedUploadUrl(
    userId: string,
    filename: string,
    contentType: string,
    category: 'avatar' | 'event' | 'reel' = 'event',
  ) {
    // Validate MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (!allowedTypes.includes(contentType)) {
      throw new BadRequestException('Desteklenmeyen dosya türü! JPG, PNG, WEBP veya MP4 kullanınız.');
    }

    const extension = filename.split('.').pop() || 'jpg';
    const key = `${category}/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 600 });
      const publicUrl = `${this.publicDomain}/${key}`;

      return {
        uploadUrl,
        publicUrl,
        key,
      };
    } catch {
      // Fallback preview URL in local mock/dev mode
      return {
        uploadUrl: 'https://placeholder-upload-url.local',
        publicUrl: `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80`,
        key,
      };
    }
  }
}
