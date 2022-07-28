import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from './prisma/prisma.module';
import { FitxService } from './fitx/fitx.service';
import { TimeService } from "./time/time.service";

@Module({
  imports: [HttpModule,
  ScheduleModule.forRoot(), ConfigModule.forRoot(), PrismaModule],
  controllers: [AppController],
  providers: [FitxService, TimeService],
})
export class AppModule {}
