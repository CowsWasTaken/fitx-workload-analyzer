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

  async getData(id: number): Promise<string> {
    const apiData = await firstValueFrom(this.http.get(this.getUrl(id)));
    return apiData.data.toString();
  }

  getUrl(id: number) {
    return this.baseUrl.replace('{id}', id.toString())
  }
}


