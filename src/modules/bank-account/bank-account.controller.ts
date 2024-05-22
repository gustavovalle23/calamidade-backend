import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/roles/roles.guard';
import { UserRoleEnum } from '../user/enums/roles.enum';
import { Roles } from '../user/roles/roles.decorator';

@ApiBearerAuth()
@Roles(UserRoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Bank Account')
@Controller({
  path: 'bank-account',
  version: '1'
})
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() request, @Body() createBankAccountDto: CreateBankAccountDto) {
    return this.bankAccountService.create(request.user, createBankAccountDto);
  }

  @Get('/me')
  findAllByUser(@Request() request) {
    return this.bankAccountService.findAllByUser(request.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankAccountService.findOne({ id: +id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBankAccountDto: UpdateBankAccountDto) {
    return this.bankAccountService.update(+id, updateBankAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.bankAccountService.remove(+id);
  }
}
