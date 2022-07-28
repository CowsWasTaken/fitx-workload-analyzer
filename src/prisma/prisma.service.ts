import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  createWorkload(percentage: number) {
    return this.workloadRecord.create( {
      data: {
        percentage,
        timestamp: new Date().valueOf()
      }, select: {
        percentage: true, timestamp: true, id: false
      }
    })
  }

  getWorkloads() {
    return this.workloadRecord.findMany({
      select: {
        percentage: true, timestamp: true, id: false
      }
    })
  }
}
