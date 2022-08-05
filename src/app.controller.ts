import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { FitxService } from "./fitx/fitx.service";
import { StudioCreateDto } from "./model/studioCreate.dto";

@Controller()
export class AppController {
  constructor(private readonly fitxService: FitxService) {
  }

  @Post("studio")
  async saveStudio(@Body() studioCreate: StudioCreateDto) {
    return await this.fitxService.saveStudio(studioCreate.id, studioCreate.interval);
  }

  @Get("studio/:id")
  async getCurrentData(@Param("id", ParseIntPipe) id: number) {
    return await this.fitxService.processWorkload(id);
  }

  @Get("studio/:id/history")
  async getHistory(@Param("id", ParseIntPipe) id: number) {
    return await this.fitxService.getAll(id);
  }
}
