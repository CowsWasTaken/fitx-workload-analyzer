import { Injectable, Logger } from "@nestjs/common";

import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Workload } from "./model/workload";
import { Interval } from "@nestjs/schedule";
import { WorkloadRecord } from "./Record";

@Injectable()
export class DataService {

  dataHistory : WorkloadRecord[] = []

  private readonly logger = new Logger(DataService.name);

  url = process.env.WORKLOAD_URL
  interval = parseInt(process.env.INTERVAL) || 600000 // 10min

  constructor(private http: HttpService) {
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

    const timestamp = new Date().valueOf()
    this.dataHistory.push({ timestamp, workload })
    return workload
  }

}
