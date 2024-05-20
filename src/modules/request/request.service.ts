import { CreateRequestDto } from "./dto/create-request.dto";
import { CreateRequestForOthersDto } from "./dto/create-request-for-others.dto";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { CooperatedEntity } from '../cooperated/entities/cooperated.entity';
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { HttpException, HttpStatus, Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { JwtPayloadType } from "../auth/strategies/types/jwt-payload.type";
import { NullableType } from "src/utils/types/nullable.type";
import { RequestEntity } from "./entities/request.entity";
import { Repository } from "typeorm";
import { UpdateRequestDto } from "./dto/update-request.dto";
import { User } from "../user/entities/user.entity";
import { UsersService } from "../user/users.service";
import { HashGeneratorUtil } from "src/utils/hash-generator";

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(RequestEntity)
    private requestRepository: Repository<RequestEntity>,
    @InjectRepository(CooperatedEntity)
    private cooperatedRepository: Repository<CooperatedEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly usersService: UsersService
  ) {}

  async create(userJwtPayload: JwtPayloadType, createRequestDto: CreateRequestDto) {
    const currentUser = await this.userRepository.findOne({
      where: {
        id: userJwtPayload.id,
      },
    });

    if (!currentUser) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: "userNotFound",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.requestRepository.save(
      this.requestRepository.create({
        ...createRequestDto,
        user: {
          id: currentUser.id,
        },
      }),
    );
  }

  async createForOthers(userJwtPayload: JwtPayloadType, createRequestForOthersDto: CreateRequestForOthersDto) {
    const currentUser = await this.userRepository.findOne({
      where: {
        id: userJwtPayload.id,
      },
    });

    if (!currentUser) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: "userNotFound",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const assistedUser = await this.userRepository.findOne({
      where: {
        document: createRequestForOthersDto.documentOfAssisted,
      },
    })

    if(assistedUser) {
      return this.requestRepository.save(
        this.requestRepository.create({
          ...createRequestForOthersDto,
          user: {
            id: assistedUser.id,
          },
          godFather: {
            id: currentUser.id,
          }
        }),
      );
    }else {
      const assistedCooperated = await this.cooperatedRepository.findOne({
        where: {
          document: createRequestForOthersDto.documentOfAssisted
        }
      })
      
      if (!assistedCooperated) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              assisted: "assisted Not Found, please create a new user for this assisted",
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const newUser = await this.usersService.create(this.transformCooperatedToCreateUserDto(assistedCooperated));
      return this.requestRepository.save(
        this.requestRepository.create({
          ...createRequestForOthersDto,
          user: {
            id: newUser.id,
          },
          godFather: {
            id: currentUser.id,
          }
        }),
      );
    }
  }

  findManyWithPagination(paginationOptions: IPaginationOptions): Promise<RequestEntity[]> {
    const { ordering } = paginationOptions;
    return this.requestRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: {
        id: ordering ? ordering : "ASC",
      },
    });
  }

  findOne(fields: EntityCondition<RequestEntity>): Promise<NullableType<RequestEntity>> {
    return this.requestRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return this.requestRepository.save(
      this.requestRepository.create({
        id,
        ...updateRequestDto,
      }),
    );
  }

  async remove(id: number): Promise<void> {
    this.requestRepository.softDelete(id);
  }

  transformCooperatedToCreateUserDto(cooperated: CooperatedEntity): CreateUserDto {
    const userDto = new CreateUserDto();
    userDto.email = cooperated.email;
    userDto.firstName = cooperated.firstName;
    userDto.lastName = cooperated.lastName;
    userDto.password = HashGeneratorUtil.generate();
    userDto.document = cooperated.document ?? '';
    userDto.telephone = cooperated.phone ?? ''
    return userDto
  }
}
