import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDTO } from "./dto/auth.credentials.dto";


export class UsersRepository extends Repository<User> {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super(
            userRepository.target,
            userRepository.manager,
            userRepository.queryRunner,
        );
    }

    public saveUser(result: User) {
        return this.userRepository.save(result);

    }

    public async createUser(authCredentials: AuthCredentialsDTO): Promise<void> {
        const { username, password } = authCredentials;

        const task = await this.userRepository.create({
            username,
            password,
        });

        await this.saveUser(task);
    }

    public getOneUser(username: string): Promise<User> {
        return this.userRepository.findOne({where:{ username }});
    }
}