import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../tasks.enum";

export class FilterTaskDTO{
    @IsOptional()
    @IsString()
    search?:string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?:TaskStatus;
}