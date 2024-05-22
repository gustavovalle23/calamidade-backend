import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class CreateBankAccountDto {
  @ApiProperty({ example: "Banco do Brasil" })
  @IsNotEmpty()
  @MinLength(3)
  bankName: string;

  @ApiProperty({ example: "9999", type: String })
  @IsOptional()
  agency: string | null;

  @ApiProperty({ example: "99999", type: String })
  @IsNotEmpty()
  @IsOptional()
  account: string | null;

  @ApiProperty({ example: "9", type: String })
  @IsOptional()
  digit: string | null;

  @ApiProperty({ example: "123-456-789-123" })
  @IsOptional()
  keyPix: string | null;
}
