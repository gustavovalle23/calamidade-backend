import { RequestHelpTypeEntity } from "./../../../modules/request/help-type/entities/request-help-type.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RequestSeedService } from "./request-seed.service";
import { RequestEntity } from "src/modules/request/entities/request.entity";
import { RequestStatusEntity } from "src/modules/request/status/entities/request-status.entity";
import { User } from "src/modules/user/entities/user.entity";
import { UserRole } from "src/modules/user/entities/user-role.entity";
import { UserStatus } from "src/modules/user/entities/user-status.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity, RequestStatusEntity, RequestHelpTypeEntity, User, UserRole, UserStatus])],
  providers: [RequestSeedService],
  exports: [RequestSeedService],
})
export class RequestSeedModule {}
