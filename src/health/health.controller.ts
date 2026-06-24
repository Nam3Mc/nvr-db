import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async checkHealth() {
    const databaseResult = await this.prisma.$queryRaw<
      { database_status: number }[]
    >`SELECT 1::int AS database_status`;

    return {
      status: 'ok',
      api: 'running',
      database:
        databaseResult[0]?.database_status === 1 ? 'connected' : 'unknown',
      timestamp: new Date().toISOString(),
    };
  }
}