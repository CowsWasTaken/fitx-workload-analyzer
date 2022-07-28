import { Controller, Get } from "@nestjs/common";
import { DataService } from "./data.service";

@Controller()
export class AppController {
  constructor(private readonly dataService: DataService) {}



  @Get()
  async getCurrentData() {
    return await this.dataService.storeWorkload()
  }

  @Get("history")
  async getHistory() {
    return await this.dataService.getAll();
  }
}
