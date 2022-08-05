import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "../../environment.variables";

@Injectable()
export class StudioHttpClientService {

  baseUrl = this.configService.get('BASE_URL',  { infer: true });

  constructor(private http: HttpService, private configService: ConfigService<EnvironmentVariables>) {
  }

  async fetchWebsiteAsString(id: number): Promise<string> {
    const fitXData = await firstValueFrom(this.http.get(this.getUrl(id)));
    return fitXData.data.toString();
  }

  getUrl(id: number) {
    return this.baseUrl.replace('{id}', id.toString())
  }
}


