import { Injectable, Logger } from "@nestjs/common";

import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { WorkloadFitxDTO } from "./model/workloadFitxDTO";
import { Interval } from "@nestjs/schedule";
import { PrismaService } from "./prisma/prisma.service";
import { WorkloadRecordDTO } from "./model/workloadRecordDTO";

@Injectable()
export class DataService {

  private readonly logger = new Logger(DataService.name);

  url = process.env.WORKLOAD_URL

  constructor(private http: HttpService, private prisma: PrismaService) {
  }

  async fetchWebsiteAsString(): Promise<string> {
    const fitXData = await firstValueFrom(this.http.get(this.url))
    return fitXData.data.toString()

  }

  extractWorkload(data: string): WorkloadFitxDTO {
    const workloadData = data.substring(data.indexOf('workload'))
    let mySubString = workloadData.substring(
      workloadData.indexOf("{"),
      workloadData.lastIndexOf("}")
    );
    mySubString = mySubString.replace(/\\/g, '');
    return JSON.parse(mySubString)
  }


  @Interval(300000) // every 10min in milliseconds
  async processWorkload() {
    const workloadFitxDTO = await this.fetchWorkload();
    const workload = this.storeWorkload(workloadFitxDTO.percentage)
    this.logger.debug('Current data from:' + new Date());
    this.logger.debug(workload)
    return workload
  }

  async storeWorkload(percentage: number): Promise<WorkloadRecordDTO> {
    return await this.prisma.createWorkload(percentage)
  }

  private async fetchWorkload() {
    const data = await this.fetchWebsiteAsString();
    return this.extractWorkload(data);
  }

  async getAll(): Promise<WorkloadRecordDTO[]> {
    return await this.prisma.getWorkloads();
  }

}
