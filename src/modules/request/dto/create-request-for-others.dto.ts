import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
  ValidateIf
} from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { RequestStatusEntity } from '../status/entities/request-status.entity';
import { RequestHelpTypeEntity } from '../help-type/entities/request-help-type.entity';
import { IsValidCpfOrCnpjConstraint } from 'src/utils/validators/is-document.validator';

export class CreateRequestForOthersDto {
  @ApiProperty({ example: 'Título' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Descrição' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '1000' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ type: RequestStatusEntity })
  @IsOptional()
  status?: RequestStatusEntity;

  @ApiProperty({ type: RequestHelpTypeEntity })
  @IsNotEmpty()
  helpType: RequestHelpTypeEntity;

  @ApiProperty({ example: '99999999999' })
  @MinLength(11)
  @Validate(IsValidCpfOrCnpjConstraint, {
    message: 'invalidDocument',
  })
  @IsNotEmpty()
  documentOfAssisted: string;

  @ApiProperty()
  @ValidateIf(req => (!req.financialBank && !req.financialAgency && !req.financialAccount) || req.financialPixkey)
  @IsNotEmpty()
  financialPixkey?: string;

  @ApiProperty()
  @ValidateIf(req => !req.financialPixkey || req.financialBank)
  @IsNotEmpty()
  financialBank?: string;

  @ApiProperty()
  @ValidateIf(req => !req.financialPixkey || req.financialAgency)
  @IsNotEmpty()
  financialAgency?: string;

  @ApiProperty()
  @ValidateIf(req => !req.financialPixkey || req.financialAccount)
  @IsNotEmpty()
  financialAccount?: string;
}
