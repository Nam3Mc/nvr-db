import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { join } from 'path';
import { Readable } from 'stream';


type UploadImageOptions = {
    folder: string;
    publicId: string;
};

@Injectable()
export class CloudinaryService {
    constructor(
        @Inject('CLOUDINARY')
        private readonly cloudinaryClient: typeof cloudinary,
        private readonly configService: ConfigService,
    ) {}

    isConfigured(): boolean {
        const config = this.cloudinaryClient.config();

        return Boolean(config.cloud_name && config.api_key && config.api_secret);
    }

    getFolderPath(...paths: string[]): string {
        const baseFolder = this.configService.getOrThrow<string>(
            'CLOUDINARY_BASE_FOLDER',
        )

        return [baseFolder, ...paths]
            .map((path) => path.trim())
            .filter(Boolean)
            .join('/');
    }

    async uploadImage(
        file: Express.Multer.File,
        options: UploadImageOptions,
    ): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = this.cloudinaryClient.uploader.upload_stream(
                {
                    folder: options.folder,
                    public_id: options.publicId,
                    resource_type: 'image',
                    overwrite: true,
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    if (!result) {
                        reject(new Error('Cloudinary upload failed.'));
                        return;
                    }

                    resolve(result);
                }
            );

            Readable.from(file.buffer).pipe(uploadStream);
        });
    }

    async deleteImage(publicId: string): Promise<void> {
        await this.cloudinaryClient.uploader.destroy(publicId, {
            resource_type: 'image',
        });
    }

}
