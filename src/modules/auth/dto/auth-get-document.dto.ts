import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";
import { NumericOnlyTransform } from "src/infrastructure/custom-transforms";

export class GetDocumentBodyDto {
  @ApiProperty({
    example: "14267215014",
  })
  @MinLength(11)
  @IsString()
  @NumericOnlyTransform()
  document: string;
}

export class GetDocumentResponseDto {
  @ApiProperty({
    example: "Morgan Stark",
  })
  name?: string | null;

  @ApiProperty({
    example: "14267215014",
  })
  document?: string | null;

  @ApiProperty({
    example: "example@example.com",
  })
  email?: string | null;

  @ApiProperty({
    example: "5511999999999",
  })
  phone?: string | null;

  @ApiProperty({
    example: 23,
  })
  userId?: number | null;
}
