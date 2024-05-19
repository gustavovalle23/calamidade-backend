import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { CooperatedService } from './cooperated.service';
import { CreateCooperatedDto } from './dto/create-cooperated.dto';
import { UpdateCooperatedDto } from './dto/update-cooperated.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/roles/roles.guard';
import { UserRoleEnum } from '../user/enums/roles.enum';
import { Roles } from '../user/roles/roles.decorator';
import { InfinityPaginationResultType } from '../../utils/types/infinity-pagination-result.type';
import { CooperatedEntity } from './entities/cooperated.entity';
import { infinityPagination } from '../../utils/infinity-pagination';
import { NullableType } from '../../utils/types/nullable.type';
import { GetDocumentBodyDto, GetDocumentResponseDto } from '../auth/dto/auth-get-document.dto';

@ApiTags('Cooperateds')
@Controller({
  path: 'cooperateds',
  version: '1',
})
export class CooperatedController {
  constructor(private readonly cooperatedService: CooperatedService) {}

  @SerializeOptions({
    groups: ["me"],
  })
  @Post("/document/validate")
  @HttpCode(HttpStatus.OK)
  public async validateDocument(@Body() body: GetDocumentBodyDto): Promise<GetDocumentResponseDto> {
    return this.cooperatedService.validateDocument(body.document);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoleEnum.admin)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCooperatedDto: CreateCooperatedDto) {
    return this.cooperatedService.create(createCooperatedDto);
  }

  @Post('bulk')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoleEnum.admin)
  @HttpCode(HttpStatus.CREATED)
  async createBulk(@Body() createCooperatedDtos: CreateCooperatedDto[]) {
    try {
      const createdCooperateds = await this.cooperatedService.createBulk(createCooperatedDtos);
      return { success: true, createdCooperateds };
    } catch (error) {
      return { success: false, error: 'Failed to create cooperateds in bulk.' + error.message };
    }
  }


  @Get('/list')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoleEnum.user)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<InfinityPaginationResultType<CooperatedEntity>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.cooperatedService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoleEnum.user)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<CooperatedEntity>> {
    return this.cooperatedService.findOne({ id: +id });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoleEnum.user)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateCooperatedDto: UpdateCooperatedDto,
  ) {
    return this.cooperatedService.update(+id, updateCooperatedDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoleEnum.user)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.cooperatedService.softDelete(id);
  }
}
