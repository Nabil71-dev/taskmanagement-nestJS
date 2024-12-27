import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { FilterTaskDTO } from './dto/get-task.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    private taskRepository: TasksRepository,
  ) { }

  public getAllTask(filterTaskDTO: FilterTaskDTO, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterTaskDTO, user);
  }

  public async getTaskById(id: string,user:User): Promise<Task> {
    const found = await this.taskRepository.getTaskById(id,user);

    if (!found) {
      this.notFoundMethod("Task not found");
    }

    return found;
  }

  public createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;

    return this.taskRepository.createTask(title, description, user);
  }

  public async deleteTaskById(id: string,user:User): Promise<void> {
    const result = await this.taskRepository.deleteTask(id,user);

    if (!result.affected) {
      this.notFoundMethod("Task is not available");
    }
  }

  public async updateTaskById(id: string, UpdateTaskDTO: UpdateTaskDTO,user:User): Promise<Task> {
    const { status } = UpdateTaskDTO;

    const result = await this.getTaskById(id,user);
    result.status = status;

    return this.taskRepository.saveTask(result);
  }

  private notFoundMethod(message) {
    throw new NotFoundException(message);
  }
}
