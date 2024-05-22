import { Module } from '@nestjs/common';
import { UserAddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressEntity } from './entities/address.entity';
import { User } from '../entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserAddressEntity, User])],
  controllers: [AddressController],
  providers: [UserAddressService],
  exports: [UserAddressService]
})
export class AddressModule {}
