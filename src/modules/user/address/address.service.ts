import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { AddressEntity } from "./entities/address.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { EntityCondition } from "../../../utils/types/entity-condition.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { ResourceNotFoundException } from "src/infrastructure/exceptions/resource-not-found.exception";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
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

    return await this.addressRepository.save(
      this.addressRepository.create({
        ...createAddressDto,
        user,
      }),
    );
  }

  findAll() {
    return `This action returns all address`;
  }

  async findOne(fields: EntityCondition<AddressEntity>): Promise<NullableType<AddressEntity>> {
    const address = await this.addressRepository.findOne({
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
    this.addressRepository.delete({ id });
  }
}
