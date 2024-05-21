import { Module } from "@nestjs/common";
import { CooperatedService } from "./cooperated.service";
import { CooperatedController } from "./cooperated.controller";
import { IsNotExist } from "../../utils/validators/is-not-exists.validator";
import { IsExist } from "../../utils/validators/is-exists.validator";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CooperatedEntity } from "./entities/cooperated.entity";
import { OrganizationService } from "../organization/organization.service";
import { OrganizationEntity } from "../organization/entities/organization.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CooperatedEntity, OrganizationEntity])],
  controllers: [CooperatedController],
  providers: [IsExist, IsNotExist, CooperatedService, OrganizationService],
  exports: [CooperatedService]
})
export class CooperatedModule {}
