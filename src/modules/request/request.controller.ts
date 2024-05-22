import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Request,
  SerializeOptions,
} from "@nestjs/common";
import { RequestService } from "./request.service";
import { CreateRequestDto } from "./dto/create-request.dto";
import { UpdateRequestDto } from "./dto/update-request.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserRoleEnum } from "../user/enums/roles.enum";
import { Roles } from "../user/roles/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../user/roles/roles.guard";
import { infinityPagination } from "src/utils/infinity-pagination";
import { NullableType } from "src/utils/types/nullable.type";
import { RequestEntity } from "./entities/request.entity";
import { CreateRequestForOthersDto } from "./dto/create-request-for-others.dto";
import { OrderingEnum } from "./enums/ordering-filter.enum";

@ApiBearerAuth()
@Roles(UserRoleEnum.user, UserRoleEnum.admin)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiTags("Requests")
@Controller({
  path: "requests",
  version: "1",
})
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() request, @Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(request.user, createRequestDto);
  }

  @Post("/godfather")
  @HttpCode(HttpStatus.CREATED)
  async createForOthers(@Request() request, @Body() createRequestForOthersDto: CreateRequestForOthersDto) {
    return await this.requestService.createForOthers(request.user, createRequestForOthersDto);
  }

  @SerializeOptions({
    groups: ["me"],
  })
  @Get("/list")
  @ApiQuery({ name: "ordering", enum: OrderingEnum, required: false, description: "ASC para ascendente e DESC para descendente" })
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("ordering", new DefaultValuePipe(OrderingEnum.ASC)) ordering: OrderingEnum,
  ) {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.requestService.findManyWithPagination({
        page,
        limit,
        ordering,
      }),
      { page, limit, ordering },
    );
  }

  @SerializeOptions({
    groups: ["me"],
  })
  @Get("/feed")
  @ApiQuery({ name: "ordering", enum: OrderingEnum, required: false, description: "ASC para ascendente e DESC para descendente" })
  async findAllFeed(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("ordering", new DefaultValuePipe(OrderingEnum.ASC)) ordering: OrderingEnum,
  ) {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.requestService.findManyWithPagination({
        page,
        limit,
        ordering,
      }, true),
      { page, limit, ordering },
    );
  }

  @SerializeOptions({
    groups: ["me"],
  })
  @Get(":id")
  findOne(@Param("id") id: string): Promise<NullableType<RequestEntity>> {
    return this.requestService.findOne({ id: +id });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(+id, updateRequestDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.requestService.remove(+id);
  }
}
