import { IsEnum } from "class-validator";
import { TaskStatus } from "../tasks.enum";

export class UpdateTaskDTO{

    @IsEnum(TaskStatus)
    status?:TaskStatus;
}