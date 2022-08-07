import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from "@nestjs/common";
import { FitxService } from "./fitx/fitx.service";
import { StudioCreateDto } from "./model/studio-create.dto";
import { NotFoundInterceptor } from "./interceptors/not-found.interceptor";
import { PostAuthInterceptor } from "./interceptors/post-auth-interceptor.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { StudioDto } from "./model/studio.dto";
import { StudioHistoryDto } from "./model/studio-history.dto";
import { WorkloadDto } from "./model/workload.dto";

@ApiTags('studio')
@Controller("studio")
@UseInterceptors(PostAuthInterceptor, NotFoundInterceptor)
export class AppController {
  constructor(private readonly fitxService: FitxService) {
  }

  @Post()
  @ApiBody({type: [StudioDto]})
  async saveStudio(@Body() studioCreate: StudioCreateDto): Promise<StudioDto> {
    return await this.fitxService.saveStudio(studioCreate.id, studioCreate.interval);
  }

  @Get()
  async getStudios(): Promise<StudioDto[]> {
    return await this.fitxService.getStudios();
  }

  @Get("/:id")
  async getCurrentWorkload(@Param("id", ParseIntPipe) id: number): Promise<WorkloadDto> {
    return await this.fitxService.processWorkload(id);
  }

  @Get("/:id/history")
  async getHistory(@Param("id", ParseIntPipe) id: number): Promise<StudioHistoryDto> {
    return await this.fitxService.getAll(id);
  }
}
