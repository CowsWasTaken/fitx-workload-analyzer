import { INestApplication, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient, Studio } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }

  async createWorkload(percentage: number, timestamp: number, studioId: number) {
    this.logger.debug({ percentage, studioId });
    return this.workloadRecord.create({
      data: {
        percentage, timestamp, studioId
      }, select: {
        percentage: true, timestamp: true
      }
    });
  }

  getWorkloads(studioId: number) {
    return this.studio.findUniqueOrThrow({
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
    this.logger.log(`Created/Updated Studio: ${studio.id}`);
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

  async isStudioExisting(id: number) {
    const num = this.studio.count({
      where: {
        id
      }
    });
    return await num > 0;
  }
}
