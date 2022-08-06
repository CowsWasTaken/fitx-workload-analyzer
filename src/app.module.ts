import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { FitxService } from "./fitx/fitx.service";
import { TimeService } from "./services/time/time.service";
import { StudioHttpClientService } from "./services/studio-http-client/studio-http-client.service";
import { DataExtractorService } from "./services/data-extractor/data-extractor.service";
import { CronSchedulerService } from "./services/cron-scheduler/cron-scheduler.service";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [HttpModule,
    ScheduleModule.forRoot(), ConfigModule.forRoot(), PrismaModule, HealthModule],
  controllers: [AppController],
  providers: [FitxService, TimeService, StudioHttpClientService, DataExtractorService, CronSchedulerService]
})
export class AppModule {
}
