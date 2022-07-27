import { Controller, Get } from "@nestjs/common";
import { DataService } from './data.service';

@Controller()
export class AppController {
  constructor(private readonly appService: DataService) {}



  @Get()
  async getCurrentData() {
    const fitx = await this.appService.fetchWebsiteAsString();
    return this.appService.extractWorkload(fitx)
  }

  @Get("history")
  getHistory() {
    return this.appService.dataHistory
  }

}
