import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ItemsModule } from './items/items.module';
import { ServicePestsModule } from './service-pests/service-pests.module';
import { ServicePhotosModule } from './service-photos/service-photos.module';
import { ServiceItemsModule } from './service-items/service-items.module';
import { ServicesModule } from './services/services.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),

        PORT: Joi.number().port().default('3001'),

        DATABASE_URL: Joi.string().required(),

        FRONTEND_URL: Joi.string().uri().required(),

        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        CLOUDINARY_BASE_FOLDER: Joi.string().required(),

        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRES_IN: Joi.number().required(),

      })
    }),
    PrismaModule,
    HealthModule,
    UserModule,
    CloudinaryModule,
    AuthModule,
    ClientsModule,
    ItemsModule,
    ServicePestsModule,
    ServicePhotosModule,
    ServiceItemsModule,
    ServicesModule,
    ActivitiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
