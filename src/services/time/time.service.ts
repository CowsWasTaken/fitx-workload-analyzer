import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "../../environment.variables";

@Injectable()
export class TimeService {

  constructor(private http: HttpService, private configService: ConfigService<EnvironmentVariables>) {
  }

  url = this.configService.get('TIME_URL',  { infer: true });

  getTime() {
    return firstValueFrom(this.http.get<{unixtime: number}>(this.url))
  }
}
