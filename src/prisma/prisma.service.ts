import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient, Studio } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }

  async createWorkload(percentage: number, timestamp: number, studioId: number) {
    return this.workloadRecord.create({
      data: {
        percentage, timestamp, studioId
      }, select: {
        percentage: true, timestamp: true
      }
    });
  }

  getWorkloads(studioId: number) {
    return this.studio.findUnique({
      where: {
        id: studioId
      }, select: {
        id: true, name: true, workloadRecords: {
          select: {
            percentage: true, timestamp: true
          }
        }
      }
    });
  }

  async createOrUpdateStudio(studio: Studio) {
    const { name, interval, id } = studio;
    return this.studio.upsert({
      where: {
        id
      }, create: {
        id, name, interval
      }, update: {
        name, interval
      }
    });
  }

  async getStudios() {
    return this.studio.findMany({
      select: {
        interval: true, id: true, name: true
      }
    });
  }
}
