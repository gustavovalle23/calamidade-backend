import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { RequestEntity } from "../entities/request.entity";

export class ListRequestsDto {
  @ApiProperty({ type: [RequestEntity] })
  @IsNotEmpty()
  forOthers: RequestEntity[];

  @ApiProperty({ type: [RequestEntity] })
  @IsNotEmpty()
  forMe: RequestEntity[];
}
