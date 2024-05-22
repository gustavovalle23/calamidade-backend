import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";
import { isStringNullOrEmpty } from "../../../../utils/string-util";

export class CreateAddressDto {
  @ValidateIf((dto: CreateAddressDto) => isStringNullOrEmpty(dto.locationLatitude) || isStringNullOrEmpty(dto.locationLongitude))
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @ApiProperty({ example: "Rua Teste" })
  street?: string | null;

  @ValidateIf((dto: CreateAddressDto) => isStringNullOrEmpty(dto.locationLatitude) || isStringNullOrEmpty(dto.locationLongitude))
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Próximo ao parque" })
  complement?: string | null;

  @ValidateIf((dto: CreateAddressDto) => isStringNullOrEmpty(dto.locationLatitude) || isStringNullOrEmpty(dto.locationLongitude))
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "1A" })
  number?: string | null;

  @IsOptional()
  @ApiProperty({ example: "Cidade ABC" })
  city?: string | null;

  @ValidateIf((dto: CreateAddressDto) => isStringNullOrEmpty(dto.locationLatitude) || isStringNullOrEmpty(dto.locationLongitude))
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "RS", minLength: 2, maxLength: 2 })
  uf?: string | null;

  @ValidateIf((dto: CreateAddressDto) => isStringNullOrEmpty(dto.locationLatitude) || isStringNullOrEmpty(dto.locationLongitude))
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "197010140", minLength: 2, maxLength: 2 })
  cep?: string | null;

  @ValidateIf((dto: CreateAddressDto) => isStringNullOrEmpty(dto.locationLatitude) || isStringNullOrEmpty(dto.locationLongitude))
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Nome do Endereco" })
  addressName?: string | null;

  @ValidateIf((dto: CreateAddressDto) => isStringNullOrEmpty(dto.street) || isStringNullOrEmpty(dto.complement) || isStringNullOrEmpty(dto.number))
  @ApiProperty({ example: "-29.922854087046", type: String })
  @IsOptional()
  locationLatitude?: string | null;

  @ValidateIf((dto: CreateAddressDto) => isStringNullOrEmpty(dto.street) || isStringNullOrEmpty(dto.complement) || isStringNullOrEmpty(dto.number))
  @ApiProperty({ example: "51.17524989736568", type: String })
  @IsOptional()
  locationLongitude?: string | null;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsInt()
  userId: number;
}
