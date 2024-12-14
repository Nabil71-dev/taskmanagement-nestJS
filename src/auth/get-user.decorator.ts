import { createParamDecorator } from "@nestjs/common";
import { User } from "./user.entity";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";

export const GetUser = createParamDecorator((_data, ctx: ExecutionContextHost): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
})