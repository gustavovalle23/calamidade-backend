import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { BankAccountEntity } from './entities/bank-account.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NullableType } from '../../utils/types/nullable.type';
import { EntityCondition } from '../../utils/types/entity-condition.type';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccountEntity)
    private bankAccountRepository: Repository<BankAccountEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  async create(userJwtPayload: JwtPayloadType, createBankAccountDto: CreateBankAccountDto) {
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

    return this.bankAccountRepository.save(
      this.bankAccountRepository.create({
        ...createBankAccountDto,
        document: currentUser.document,
        user: {
          id: currentUser.id,
        },
      }),
    );
  }

  async findAllByUser(userJwtPayload: JwtPayloadType) {
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

    return await this.bankAccountRepository.find({
      where: {
        user: {
          id: currentUser.id
        }
      }
    })
  }

  findOne(fields: EntityCondition<BankAccountEntity>): Promise<NullableType<BankAccountEntity>> {
    return this.bankAccountRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateBankAccountDto: UpdateBankAccountDto) {
    return this.bankAccountRepository.save(
      this.bankAccountRepository.create({
        id,
        ...updateBankAccountDto,
      }),
    );
  }

  remove(id: number) {
    this.bankAccountRepository.softDelete(id);
  }
}
