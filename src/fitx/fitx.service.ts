import { Injectable, Logger, OnModuleInit } from "@nestjs/common";

import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { PrismaService } from "../prisma/prisma.service";
import { WorkloadFitxDTO } from "../model/workloadFitxDTO";
import { SchedulerRegistry } from "@nestjs/schedule";
import { WorkloadRecordDTO } from "../model/workloadRecordDTO";
import { TimeService } from "../time/time.service";

@Injectable()
export class FitxService implements OnModuleInit{


  onModuleInit() {
    const interval = setInterval(() => this.processWorkload(), parseInt(process.env.INTERVAL));
    this.schedulerRegistry.addInterval('fetch-workload-interval', interval);
  }

  url = process.env.WORKLOAD_URL;
  private readonly logger = new Logger(FitxService.name);

  constructor(private http: HttpService, private prisma: PrismaService, private timeService: TimeService, private schedulerRegistry: SchedulerRegistry) {
  }

  async fetchWebsiteAsString(): Promise<string> {
    const fitXData = await firstValueFrom(this.http.get(this.url));
    return fitXData.data.toString();

  }

  extractWorkload(data: string): WorkloadFitxDTO {
    let substring = ''
    try {
      const workloadData = data.substring(data.indexOf("workload"));
      substring = workloadData.substring(
        workloadData.indexOf("{"),
        workloadData.indexOf("}") + 1
      );
      substring = substring.replace(/\\/g, "");
      return JSON.parse(substring);
    } catch (e) {
      Logger.error("Could not parse Workload to correct format")
      Logger.error(`Substring: ${substring}`)
    }
  }


  async processWorkload() {
    const workloadFitxDTO = await this.fetchWorkload();
    const timestamp = (await this.timeService.getTime()).data.unixtime;
    const workload = await this.storeWorkload(workloadFitxDTO.percentage, timestamp);
    this.logger.debug("Current data from:" + new Date(timestamp * 1000));
    this.logger.debug(workload);
    return workload;
  }

  async storeWorkload(percentage: number, timestamp: number): Promise<WorkloadRecordDTO> {
    return await this.prisma.createWorkload(percentage, timestamp);
  }

  async getAll(): Promise<WorkloadRecordDTO[]> {
    return await this.prisma.getWorkloads();
  }

  private async fetchWorkload() {
    const data = await this.fetchWebsiteAsString();
    return this.extractWorkload(data);
  }

}
