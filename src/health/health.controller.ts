import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { PrismaOrmHealthIndicator } from "../prisma/PrismaOrmHealthIndicator.service";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    @Inject(PrismaOrmHealthIndicator)
    private db: PrismaOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('fitx availability check', 'https://www.fitx.de/fitnessstudios'),
      () => this.db.pingCheck('db_status'),
      () => this.memory.checkHeap('memory_heap', 300*1024*1024),
      () => this.memory.checkRSS('memory_rss', 300*1024*1024),
    ]);
  }
}
