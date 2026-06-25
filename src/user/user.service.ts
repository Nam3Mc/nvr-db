import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from './utils/password.util';
import { UserRole } from '../generated/prisma/enums';
import { NotFoundError } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
    constructor( 
      private readonly prisma: PrismaService,
      private readonly cloudinaryService: CloudinaryService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: createUserDto.email },
                    { documentNumber: createUserDto.documentNumber },
                ],
            },
        });

        if (existingUser) {
            throw new ConflictException(
                'An user with this email or document number already exists',
            );
        }

        const passwordHash = await hashPassword(createUserDto.password);

        return this.prisma.user.create({
            data: {
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
                email: createUserDto.email,
                phone: createUserDto.phone,
                documentNumber: createUserDto.documentNumber,
                passwordHash,
                role: createUserDto.role ?? UserRole.TECHNICIAN,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                documentNumber: true,
                isActive: true,
                profilePhotoUrl: true,
            },
        });
    }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                documentNumber: true,
                role: true,
                salary: true,
                isActive: true,
                profilePhotoUrl: true,
            },
            orderBy: {
                firstName: 'desc',
            }
        })
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                documentNumber: true,
                role: true,
                salary: true,  
                isActive: true,
                profilePhotoUrl: true,
            },
        });

        if (!user) {
            throw new NotFoundError('User not found.');
        }

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found.');
      }

      if (Object.keys(updateUserDto).length === 0) {
        throw new BadRequestException('At least one field must be provided.');
      }

      if (updateUserDto.email || updateUserDto.documentNumber) {
        const duplicatedUser = await this.prisma.user.findFirst({
          where: {
            id: {
              not: id,
            },
            OR: [
              updateUserDto.email ? { email: updateUserDto.email } : {},
              updateUserDto.documentNumber
                ? { documentNumber: updateUserDto.documentNumber }
                : {},
            ],
          },
        });

        if (duplicatedUser) {
          throw new ConflictException(
            'A user with this email or document number already exists.',
          );
        }
      }

      const { password, ...userData } = updateUserDto;

      const passwordHash = password ? await hashPassword(password) : undefined;

      return this.prisma.user.update({
        where: { id },
        data: {
          ...userData,
          ...(passwordHash ? { passwordHash } : {}),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          documentNumber: true,
          role: true,
          salary: true,
          isActive: true,
          profilePhotoUrl: true,
        },
      });
    }

    async deactivate(id: string) {
      const user = await this.prisma.user.findUnique({
        where: {id},
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      if ( !user.isActive ) {
        throw new BadRequestException('User is already inactive.');
      }

      return this.prisma.user.update({
        where: {id},
        data: {
          isActive: false,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          documentNumber: true,
          role: true,
          salary: true,
          isActive: true,
          profilePhotoUrl: true,
        }
      })
    }

    async activate(id:string) {
      const user = await this.prisma.user.findUnique({
        where: {id},
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      if (user.isActive) {
        throw new BadRequestException('User is already active.');
      }

      return this.prisma.user.update({
        where: {id},
        data: {
          isActive: true,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          documentNumber: true,
          role: true,
          salary: true,
          isActive: true,
          profilePhotoUrl: true,
        }
      })
    }

    async uploadProfilePhoto(id: string, file: Express.Multer.File) {
      const user = await this.prisma.user.findUnique({
        where: {id},
        select: {
          id: true,
          profilePhotoPublicId: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const folder = this.cloudinaryService.getFolderPath(
        'users',
        'profile-photos',
      );

      const publicId = `user-${id}`;

      const uploadResult = await this.cloudinaryService.uploadImage(file, {
        folder,
        publicId,
      });

      if (
        user.profilePhotoPublicId &&
        user.profilePhotoPublicId !== uploadResult.public_id
      ) {
        await this.cloudinaryService.deleteImage(user.profilePhotoPublicId);
      }

      
      return await this.prisma.user.update({
      where: { id },
      data: {
        profilePhotoUrl: uploadResult.secure_url,
        profilePhotoPublicId: uploadResult.public_id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        documentNumber: true,
        role: true,
        salary: true,
        isActive: true,
        profilePhotoUrl: true,
      },
    });
  }

  async findByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true,
        firstName: true,
        lastName: true,
        profilePhotoUrl: true,
      },
    });
  }

}
