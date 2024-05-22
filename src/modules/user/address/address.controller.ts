import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { UserAddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRoleEnum } from '../enums/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { UserAddressEntity } from './entities/address.entity';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';

@ApiBearerAuth()
@Roles(UserRoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Address')
@Controller({
  path: 'address',
  version: '1',
})
export class AddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.userAddressService.create(createAddressDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<InfinityPaginationResultType<UserAddressEntity>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.userAddressService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAddressService.findOne({ id: +id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.userAddressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAddressService.remove(+id);
  }
}
