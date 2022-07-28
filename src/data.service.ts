import { Injectable, Logger } from "@nestjs/common";

import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Workload } from "./model/workload";
import { Interval } from "@nestjs/schedule";
import { PrismaService } from "./prisma/prisma.service";

@Injectable()
export class DataService {

  private readonly logger = new Logger(DataService.name);

  url = process.env.WORKLOAD_URL
  interval = parseInt(process.env.INTERVAL) || 600000 // 10min

  constructor(private http: HttpService, private prisma: PrismaService) {
  }

  async fetchWebsiteAsString(): Promise<string> {
    const fitXData = await firstValueFrom(this.http.get(this.url))
    return fitXData.data.toString()

  }

  extractWorkload(data: string): Workload {
    const workloadData = data.substring(data.indexOf('workload'))
    let mySubString = workloadData.substring(
      workloadData.indexOf("{"),
      workloadData.lastIndexOf("}")
    );
    mySubString = mySubString.replace(/\\/g, '');
    return JSON.parse(mySubString)
  }


  @Interval(300000)
  async handleCron() {
    this.logger.debug('Current data from:' + new Date());
    const workload = this.storeWorkload()
    this.logger.debug(workload)
  }

  async storeWorkload(): Promise<Workload> {
    const data = await this.fetchWebsiteAsString();
    const workload = this.extractWorkload(data)
    const i = await this.prisma.createWorkload(workload.percentage)
    Logger.log(i)
    return workload
  }

  async getAll() {
    return await this.prisma.getWorkloads();
  }

}
