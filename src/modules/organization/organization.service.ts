import { Body, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationEntity } from './entities/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class OrganizationService {

  constructor(
    @InjectRepository(OrganizationEntity)
    private organizationRepository: Repository<OrganizationEntity>,
  ) { }

  create(createOrganizationDto) {
    console.log(createOrganizationDto)
    return this.organizationRepository.save(
      this.organizationRepository.create(createOrganizationDto),
    );
  }

  findAll() {
    return `This action returns all organization`;
  }

  findOne(fields: EntityCondition<OrganizationEntity>): Promise<NullableType<OrganizationEntity>> {
    return this.organizationRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
