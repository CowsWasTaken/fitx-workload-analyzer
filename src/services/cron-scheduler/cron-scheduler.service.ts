import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { Studio } from "@prisma/client";

@Injectable()
export class CronSchedulerService {

  private readonly intervalPrefix = "fetch-workload-";

  constructor(private schedulerRegistry: SchedulerRegistry) {
  }

  createJob(studio: Studio, task: (id: number) => Promise<any>) {
    Logger.log(`Creating Cron Job for Studio: ${studio.id} - ${studio.name}`);
    if (this.schedulerRegistry.doesExist("interval", `${this.intervalPrefix}${studio.id}`)) {
      this.schedulerRegistry.deleteInterval(`${this.intervalPrefix}${studio.id}`);
    }
    const interval = setInterval(async () => await task(studio.id), studio.interval);
    this.schedulerRegistry.addInterval(`${this.intervalPrefix}${studio.id}`, interval);
  }
}
