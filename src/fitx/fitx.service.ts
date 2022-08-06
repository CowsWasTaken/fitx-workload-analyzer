import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { TimeService } from "../services/time/time.service";
import { StudioHttpClientService } from "../services/studio-http-client/studio-http-client.service";
import { DataExtractorService } from "../services/data-extractor/data-extractor.service";
import { CronSchedulerService } from "../services/cron-scheduler/cron-scheduler.service";
import { Studio } from "@prisma/client";


@Injectable()
export class FitxService implements OnModuleInit {

  private readonly logger = new Logger(FitxService.name);

  constructor(
    private prisma: PrismaService,
    private timeService: TimeService,
    private cronScheduler: CronSchedulerService,
    private httpClient: StudioHttpClientService,
    private dataExtractor: DataExtractorService) {
  }

  async onModuleInit() {
    const studios = await this.prisma.getStudios();
    this.logger.log("Initiating Intervals for Stored Studios");
    for (const studio of studios) {
      this.createJob(studio);
    }
  }

  async processWorkload(studioId: number) {
    await this.validateStudioExisting(studioId);
    const workloadDto = await this.fetchWorkload(studioId);
    const timestamp = (await this.timeService.getTime()).data.unixtime;
    return await this.prisma.createWorkload(workloadDto.percentage, timestamp, studioId);
  }

  async getAll(studioId: number) {
    await this.validateStudioExisting(studioId);
    return await this.prisma.getWorkloads(studioId);
  }

  async saveStudio(studioId: number, interval: number) {
    const studioName = await this.fetchStudioAlias(studioId);
    if (!studioName) {
      throw new NotFoundException(`Cannot find Studio with Id:${studioId}`)
    }
 {}    const studio = await this.prisma.createOrUpdateStudio({ id: studioId, interval, name: studioName });
    this.createJob(studio);
    return studio;
  }

  private createJob(studio: Studio) {
    this.cronScheduler.createJob(studio, async () => {
      return this.processWorkload(studio.id);
    });
  }

  private async fetchStudioAlias(studioId: number) {
    const data = await this.httpClient.getData(studioId);
    return this.dataExtractor.extractStudioAlias(data);
  }

  private async fetchWorkload(studioId: number) {
    const data = await this.httpClient.getData(studioId);
    return this.dataExtractor.extractWorkload(data);
  }

  private async validateStudioExisting(studioId: number) {
    if (!await this.prisma.isStudioExisting(studioId)) {
      throw new NotFoundException("Studio not found", "Not found");
    }
  }

}
