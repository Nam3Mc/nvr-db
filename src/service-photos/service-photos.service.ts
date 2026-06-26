import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PhotoType } from 'src/generated/prisma/enums';

@Injectable()
export class ServicePhotosService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async uploadBeforePhotos(serviceId: string, files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No photo was found');
        }
        let uploadedPhotosData = [];
        const folder = this.cloudinaryService.getFolderPath(
            'service',
            'service-photos'
        )
        try {
            let photoNo = 1
            const uploadPromises = await files.map(async (file) => {
                const publicId = `photo${photoNo}$-{serviceId}`;
                const cloudinaryResult = await this.cloudinaryService.uploadImage(
                    file,
                    {
                        folder,
                        publicId,
                    },
                )
                photoNo =+ 1;
                return this.prisma.servicePhoto.create({
                    data: {
                        url: cloudinaryResult.secure_url,
                        publicId: cloudinaryResult.public_id,
                        type: PhotoType.BEFORE,
                        serviceId: serviceId,
                    }
                })
            });
            uploadedPhotosData = await Promise.all(uploadPromises);
        } catch (error){
            throw new BadRequestException('Something when wrong uploading the pictures to Cloudinary')
        }
    }

    async uploadAfterPhotos(serviceId: string, files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No photo was found');
        }
        let uploadedPhotosData = [];
        const folder = this.cloudinaryService.getFolderPath(
            'service',
            'service-photos'
        )
        try {
            let photoNo = 1
            const uploadPromises = await files.map(async (file) => {
                const publicId = `photo${photoNo}$-{serviceId}`;
                const cloudinaryResult = await this.cloudinaryService.uploadImage(
                    file,
                    {
                        folder,
                        publicId,
                    },
                )
                photoNo =+ 1;
                return this.prisma.servicePhoto.create({
                    data: {
                        url: cloudinaryResult.secure_url,
                        publicId: cloudinaryResult.public_id,
                        type: PhotoType.AFTER,
                        serviceId: serviceId,
                    }
                })
            });
            uploadedPhotosData = await Promise.all(uploadPromises);
        } catch (error){
            throw new BadRequestException('Something when wrong uploading the pictures to Cloudinary')
        }
    }
}