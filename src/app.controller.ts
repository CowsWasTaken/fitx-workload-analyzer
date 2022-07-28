import { Controller, Get } from "@nestjs/common";
import { FitxService } from "./fitx/fitx.service";

@Controller()
export class AppController {
  constructor(private readonly dataService: FitxService) {}

  @Get()
  async getCurrentData() {
    return await this.dataService.processWorkload()
  }

  @Get("history")
  async getHistory() {
    return await this.dataService.getAll();
  }
}
