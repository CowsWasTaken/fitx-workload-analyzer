import { Module } from '@nestjs/common';
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from './health.controller';
import { HttpModule } from "@nestjs/axios";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaOrmHealthIndicator } from "../prisma/PrismaOrmHealthIndicator.service";

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [ PrismaOrmHealthIndicator, PrismaService]
})
export class HealthModule {}
