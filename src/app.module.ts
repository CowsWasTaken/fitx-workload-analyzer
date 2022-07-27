import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DataService } from './data.service';
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [HttpModule,
  ScheduleModule.forRoot(), ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [DataService],
})
export class AppModule {}
