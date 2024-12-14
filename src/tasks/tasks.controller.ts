import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTaskDTO } from './dto/get-task.dto';
import { UpdateTaskDTO } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskSercvice: TasksService) { }

  @Get()
  public getTasks(
    @Query() filterTaskDTO:FilterTaskDTO,
    @GetUser() user:User
  ): Promise<Task[]> {
    return this.taskSercvice.getAllTask(filterTaskDTO,user);
  }

  @Get('/:id')
  public getTaskByID(
    @Param('id') id: string,
    @GetUser() user:User
  ): Promise<Task> {
    return this.taskSercvice.getTaskById(id,user);
  }

  @Post()
  public createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() user:User
  ): Promise<Task> {
    return this.taskSercvice.createTask(createTaskDTO,user);
  }

  @Delete('/:id')
  deleteSingleTask(
    @Param('id') id:string,
    @GetUser() user:User
  ):Promise<void>{
    return this.taskSercvice.deleteTaskById(id,user); 
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id:string, 
    @Body() UpdateTaskDTO:UpdateTaskDTO,
    @GetUser() user:User
  ):Promise<Task>{
    return this.taskSercvice.updateTaskById(id,UpdateTaskDTO,user); 
  }
}
