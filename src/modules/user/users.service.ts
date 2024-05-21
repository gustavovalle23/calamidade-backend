import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { DeepPartial, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { NullableType } from "../../utils/types/nullable.type";
import { CooperatedEntity } from "../cooperated/entities/cooperated.entity";
import { ResourceNotFoundException } from "src/infrastructure/exceptions/resource-not-found.exception";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(CooperatedEntity)
    private cooperatedRepository: Repository<CooperatedEntity>,
  ) {}

  async create(createUser: CreateUserDto): Promise<User> {
    var cooperatedSearched = await this.cooperatedRepository.findOne({ where: { document: createUser.document } });

    if (!cooperatedSearched) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            cooperated: "cooperatedNotFound",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return await this.usersRepository.save(
      this.usersRepository.create({
        ...createUser,
        cooperated: cooperatedSearched,
      }),
    );
  }

  findManyWithPagination(paginationOptions: IPaginationOptions): Promise<User[]> {
    return this.usersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  async findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
    const user = await this.usersRepository.findOne({
      where: fields,
    });

    if (!user) {
      throw new ResourceNotFoundException();
    }

    return user;
  }

  update(id: User["id"], payload: DeepPartial<User>): Promise<User> {
    return this.usersRepository.save(
      this.usersRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: User["id"]): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
