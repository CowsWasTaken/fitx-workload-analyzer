import { Body, Controller, Get, Param, ParseIntPipe, Post, UseInterceptors } from "@nestjs/common";
import { FitxService } from "./fitx/fitx.service";
import { StudioCreateDto } from "./model/studio-create.dto";
import { NotFoundInterceptor } from "./interceptors/not-found.interceptor";
import { PostAuthInterceptor } from "./interceptors/post-auth-interceptor.service";

@Controller("studio")
@UseInterceptors(PostAuthInterceptor, NotFoundInterceptor)
export class AppController {
  constructor(private readonly fitxService: FitxService) {
  }

  @Post()
  async saveStudio(@Body() studioCreate: StudioCreateDto) {
    return await this.fitxService.saveStudio(studioCreate.id, studioCreate.interval);
  }

  @Get("/:id")
  async getCurrentWorkload(@Param("id", ParseIntPipe) id: number) {
    return await this.fitxService.processWorkload(id);
  }

  @Get("/:id/history")
  async getHistory(@Param("id", ParseIntPipe) id: number) {
    return await this.fitxService.getAll(id);
  }
}
