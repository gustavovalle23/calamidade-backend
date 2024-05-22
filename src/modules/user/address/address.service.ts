import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { UserAddressEntity } from "./entities/address.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { EntityCondition } from "../../../utils/types/entity-condition.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { ResourceNotFoundException } from "src/infrastructure/exceptions/resource-not-found.exception";
import { IPaginationOptions } from "src/utils/types/pagination-options";

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddressEntity)
    private userAddressRepository: Repository<UserAddressEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    const user = await this.userRepository.findOne({ where: { id: createAddressDto.userId } });

    if (!user) {
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

    return await this.userAddressRepository.save(
      this.userAddressRepository.create({
        ...createAddressDto,
        user,
      }),
    );
  }

  findAll() {
    return `This action returns all address`;
  }

  findManyWithPagination(paginationOptions: IPaginationOptions): Promise<UserAddressEntity[]> {
    return this.userAddressRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  async findOne(fields: EntityCondition<UserAddressEntity>): Promise<NullableType<UserAddressEntity>> {
    const address = await this.userAddressRepository.findOne({
      where: fields,
    });

    if (!address) {
      throw new ResourceNotFoundException();
    }

    return address;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    this.userAddressRepository.delete({ id });
  }
}
