import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { RequestEntity } from "../entities/request.entity";
import { RequestExample } from "./examples";

export class ListRequestsDto {
  @ApiProperty({
    type: [RequestEntity],
    example: RequestExample,
  })
  @IsNotEmpty()
  forOthers: RequestEntity[];

  @ApiProperty({
    type: [RequestEntity],
    example: RequestExample,
  })
  @IsNotEmpty()
  forMe: RequestEntity[];
}
