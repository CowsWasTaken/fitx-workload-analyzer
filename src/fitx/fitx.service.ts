import { Injectable, Logger, OnModuleInit } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { TimeService } from "../services/time/time.service";
import { StudioHttpClientService } from "../services/studio-http-client/studio-http-client.service";
import { DataExtractorService } from "../services/data-extractor/data-extractor.service";
import { CronSchedulerService } from "../services/cron-scheduler/cron-scheduler.service";


@Injectable()
export class FitxService implements OnModuleInit {

  private readonly logger = new Logger(FitxService.name);

  constructor(private prisma: PrismaService, private timeService: TimeService, private cronScheduler: CronSchedulerService, private httpClient: StudioHttpClientService, private dataExtractor: DataExtractorService) {
  }

  async onModuleInit() {
    const studios = await this.prisma.getStudios();
    this.logger.log("Initiating Intervals for Stored Studios")
    for (const studio of studios) {
      this.cronScheduler.createJob( studio, async ()=> {
        return this.processWorkload(studio.id);
      } );
    }
  }

  async processWorkload(studioId: number) {
    const workloadFitxDTO = await this.fetchWorkload(studioId);
    const timestamp = (await this.timeService.getTime()).data.unixtime;
    const workload = await this.saveWorkload(studioId, workloadFitxDTO.percentage, timestamp);
    Logger.debug(`Studio: ${studioId} -> Current data from:${new Date(timestamp * 1000)}`);
    Logger.debug(workload);
    return workload;
  }

  async saveWorkload(studioId: number, percentage: number, timestamp: number) {
    return await this.prisma.createWorkload( percentage, timestamp, studioId);
  }

  async getAll(id: number) {
    return await this.prisma.getWorkloads(id);
  }

  async saveStudio(id: number, interval: number) {
    const data = await this.httpClient.fetchWebsiteAsString(id);
    const name = this.dataExtractor.extractStudioAlias(data);
    const studio = await this.prisma.createOrUpdateStudio({id, interval, name});
    this.cronScheduler.createJob(studio, async ()=> {
      return this.processWorkload(studio.id);
    })
    return studio;
  }

  private async fetchWorkload(studioId: number) {
    const data = await this.httpClient.fetchWebsiteAsString(studioId);
    return this.dataExtractor.extractWorkload(data);
  }

}
