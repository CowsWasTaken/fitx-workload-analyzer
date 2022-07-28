import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class TimeService {

  constructor(private http: HttpService) {
  }

  url = process.env.TIME_URL

  getTime() {
    return firstValueFrom(this.http.get<{unixtime: number}>(this.url))
  }
}
