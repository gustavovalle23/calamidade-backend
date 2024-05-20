import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RequestEntity } from "src/modules/request/entities/request.entity";
import { RequestStatusEntity } from "src/modules/request/status/entities/request-status.entity";
import { RequestHelpTypeEntity } from "src/modules/request/help-type/entities/request-help-type.entity";
import { User } from "src/modules/user/entities/user.entity";
import { UserRole } from "src/modules/user/entities/user-role.entity";
import { UserStatus } from "src/modules/user/entities/user-status.entity";
import { UserRoleEnum } from "src/modules/user/enums/roles.enum";
import { UserStatusEnum } from "src/modules/user/enums/status.enum";

@Injectable()
export class RequestSeedService {
  constructor(
    @InjectRepository(RequestEntity)
    private requestRepository: Repository<RequestEntity>,
    @InjectRepository(RequestStatusEntity)
    private requestStatusEntityRepository: Repository<RequestStatusEntity>,
    @InjectRepository(RequestHelpTypeEntity)
    private requestHealpTypeEntityRepository: Repository<RequestHelpTypeEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private roleRepository: Repository<UserRole>,
    @InjectRepository(UserStatus)
    private statusRepository: Repository<UserStatus>,
  ) {}

  private async createUserEntity() {
    try {
      const countAdmin = await this.userRepository.count({
        where: {
          role: {
            id: UserRoleEnum.admin,
          },
        },
      });

      if (countAdmin === 0) {
        const adminRole = await this.roleRepository.findOne({
          where: { id: UserRoleEnum.admin },
        });
        console.log("Admin role found:", adminRole);

        const activeStatus = await this.statusRepository.findOne({
          where: { id: UserStatusEnum.active },
        });
        console.log("Active status found:", activeStatus);

        if (adminRole && activeStatus) {
          const adminUser = this.userRepository.create({
            firstName: "Super",
            lastName: "Admin",
            email: "admin@coopartilhar.com.br",
            password: "password123",
            document: "99999999999",
            telephone: "99999999999",
            role: adminRole,
            status: activeStatus,
            organization: null,
          });
          await this.userRepository.save(adminUser);
          console.log("Admin user created:", adminUser);
        } else {
          console.error("Admin role or active status not found. Skipping admin user creation.");
        }
      }

      const countUser = await this.userRepository.count({
        where: {
          role: {
            id: UserRoleEnum.user,
          },
        },
      });

      if (countUser === 0) {
        const userRole = await this.roleRepository.findOne({
          where: { id: UserRoleEnum.user },
        });
        console.log("User role found:", userRole);

        const activeStatus = await this.statusRepository.findOne({
          where: { id: UserStatusEnum.active },
        });
        console.log("Active status found:", activeStatus);

        if (userRole && activeStatus) {
          const regularUser = this.userRepository.create({
            firstName: "John",
            lastName: "Stark",
            email: "john.stark@coopartilhar.com",
            password: "password123",
            document: "99999999998",
            telephone: "99999999999",
            role: userRole,
            status: activeStatus,
            organization: null,
          });
          await this.userRepository.save(regularUser);
          console.log("Regular user created:", regularUser);
        } else {
          console.error("User role or active status not found. Skipping regular user creation.");
        }
      }

      return await this.userRepository.find();
    } catch (error) {
      console.error("Error during user seeding:", error);
    }
  }

  private async createRequestHelpTypeEntity(): Promise<RequestHelpTypeEntity[]> {
    const { length: requestHelpTypeLength } = await this.requestHealpTypeEntityRepository.find();
    if (requestHelpTypeLength === 0) {
      const req1HelpType = new RequestHelpTypeEntity();
      req1HelpType.id = 1;
      req1HelpType.name = "analysis";

      this.requestHealpTypeEntityRepository.create(req1HelpType);
      return [await req1HelpType.save()];
    }
    return await this.requestHealpTypeEntityRepository.find();
  }

  private async criarRequestStatusEntity(): Promise<RequestStatusEntity[]> {
    const { length: requestStatusLength } = await this.requestStatusEntityRepository.find();
    if (requestStatusLength === 0) {
      const req1HelpType = new RequestHelpTypeEntity();
      req1HelpType.id = 1;
      req1HelpType.name = "analysis";

      this.requestHealpTypeEntityRepository.create(req1HelpType);
      return [await req1HelpType.save()];
    }
    return await this.requestHealpTypeEntityRepository.find();
  }

  async run() {
    // //criar RequestStatusEntity
    const requestStatus = await this.criarRequestStatusEntity();

    //criar RequestHelpTypeEntity
    const requestType = await this.createRequestHelpTypeEntity();

    // //criar User
    const user = await this.createUserEntity();

    const request = new RequestEntity();

    request.title = "title";
    request.description = "description";
    request.financialAgency = "agencia";
    request.amount = 200;
    request.statusId = 1;
    request.financialBank = "banco";
    request.financialAgency = "agencia";
    request.financialAccount = "conta";

    request.helpType = requestType[0];
    request.status = requestStatus[0];
    request.user = user![0];
    request.godFather = user![0];

    await this.requestRepository.save(request);
  }
}
