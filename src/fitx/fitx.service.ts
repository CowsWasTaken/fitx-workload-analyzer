import { Injectable, Logger } from "@nestjs/common";

import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { PrismaService } from "../prisma/prisma.service";
import { WorkloadFitxDTO } from "../model/workloadFitxDTO";
import { Interval } from "@nestjs/schedule";
import { WorkloadRecordDTO } from "../model/workloadRecordDTO";
import { TimeService } from "../time/time.service";

@Injectable()
export class FitxService {

  url = process.env.WORKLOAD_URL;
  private readonly logger = new Logger(FitxService.name);

  constructor(private http: HttpService, private prisma: PrismaService, private timeService: TimeService) {
  }

  async fetchWebsiteAsString(): Promise<string> {
    const fitXData = await firstValueFrom(this.http.get(this.url));
    return fitXData.data.toString();

  }

  extractWorkload(data: string): WorkloadFitxDTO {
    const workloadData = data.substring(data.indexOf("workload"));
    let mySubString = workloadData.substring(
      workloadData.indexOf("{"),
      workloadData.indexOf("}")+1
    );
    console.log(mySubString);
    mySubString = mySubString.replace(/\\/g, "");
    return JSON.parse(mySubString);
  }


  @Interval(300000) // every 10min in milliseconds
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
