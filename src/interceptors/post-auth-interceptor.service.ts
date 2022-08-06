import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "../environment.variables";

@Injectable()
export class PostAuthInterceptor implements NestInterceptor {

  secretAuthToken = this.configService.get("AUTH_TOKEN", { infer: true });

  constructor(private configService: ConfigService<EnvironmentVariables>) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    if (ctx.getRequest()["method"] === "POST") {
      this.checkQueryForAuth(ctx.getRequest());
    }
    return next
      .handle();
  }

  checkQueryForAuth(request: any) {
    const query = request["query"];
    const authToken = query["auth_token"];
    if (authToken) {
      if (authToken !== this.secretAuthToken) {
        throw new UnauthorizedException("Query Param \"auth_token\" is incorrect");
      }
    } else {
      throw new UnauthorizedException("Missing Query Param \"auth_token\" for POST authentication");
    }
  }
}
