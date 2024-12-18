import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from "./tasks.enum";
import { FilterTaskDTO } from "./dto/get-task.dto";
import { User } from "../auth/user.entity";
import { InternalServerErrorException, Logger } from "@nestjs/common";


export class TasksRepository extends Repository<Task> {
  private logger = new Logger();

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {
    super(
      taskRepository.target,
      taskRepository.manager,
      taskRepository.queryRunner,
    );
  }

  public async getTasks(filterTaskDTO: FilterTaskDTO, user: User): Promise<Task[]> {
    const { search, status } = filterTaskDTO;

    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status=:status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` }
      )
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    }
    catch (error) {
      this.logger.error(`Failed to load task for User : ${user.username}.`, error.stack,);
      this.serverErrorExceptionMethod('')
    }
  }

  public getTaskById(id: string, user: User): Promise<Task> {
    return this.taskRepository.findOne({ where: { id, user }, });
  }

  public saveTask(result: Task): Promise<Task> {
    return this.taskRepository.save(result);
  }

  public createTask(title: string, description: string, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });
    return this.saveTask(task);
  }

  public deleteTask(id: string, user) {
    return this.taskRepository.delete({ id, user });
  }

  private serverErrorExceptionMethod(message) {
    throw new InternalServerErrorException(message);
  }
}