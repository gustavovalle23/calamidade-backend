import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCooperatedDto } from "./dto/create-cooperated.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CooperatedEntity } from "./entities/cooperated.entity";
import { DataSource, DeepPartial, Repository } from "typeorm";
import { IPaginationOptions } from "../../utils/types/pagination-options";
import { EntityCondition } from "../../utils/types/entity-condition.type";
import { NullableType } from "../../utils/types/nullable.type";
import { OrganizationService } from "../organization/organization.service";
import { GetDocumentResponseDto } from "../auth/dto/auth-get-document.dto";

@Injectable()
export class CooperatedService {
  constructor(
    @InjectRepository(CooperatedEntity)
    private cooperatedRepository: Repository<CooperatedEntity>,
    private readonly organizationService: OrganizationService,
    private dataSource: DataSource,
  ) {}

  async create(createCooperatedDto: CreateCooperatedDto) {
    const organization = await this.organizationService.findOne({ id: +createCooperatedDto.organization });
    if (!organization) throw new BadRequestException("organization of provided organization is not found");

    return this.cooperatedRepository.save(this.cooperatedRepository.create({ ...createCooperatedDto, organization }));
  }

  findManyWithPagination(paginationOptions: IPaginationOptions): Promise<CooperatedEntity[]> {
    return this.cooperatedRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(fields: EntityCondition<CooperatedEntity>): Promise<NullableType<CooperatedEntity>> {
    return this.cooperatedRepository.findOne({
      where: fields,
    });
  }

  update(id: CooperatedEntity["id"], payload: DeepPartial<CooperatedEntity>): Promise<CooperatedEntity> {
    return this.cooperatedRepository.save(
      this.cooperatedRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: CooperatedEntity["id"]): Promise<void> {
    await this.cooperatedRepository.softDelete(id);
  }

  async validateDocument(documentNr: string): Promise<GetDocumentResponseDto> {
    const result = await this.cooperatedRepository
      .createQueryBuilder("cooperated")
      .leftJoinAndSelect("cooperated.user", "user")
      .select(["cooperated.id", "cooperated.email", "cooperated.firstName", "cooperated.lastName", "cooperated.phone", "cooperated.document", "user.id"])
      .where("cooperated.document = :document", { document: documentNr })
      .andWhere("cooperated.deletedAt IS NULL")
      .getOne();

    if (!result) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: "cooperatedNotFound",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const { fullName, document, email, phone, user } = result;

    return {
      name: fullName,
      document,
      email,
      phone,
      userId: user?.id,
    };
  }

  async createBulk(dtos: CreateCooperatedDto[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const cooperatedEntities = dtos.map(dto => {
      const cooperated = new CooperatedEntity();
      cooperated.email = dto.email;
      cooperated.firstName = dto.firstName;
      cooperated.lastName = dto.lastName;
      cooperated.phone = dto.phone;
      cooperated.document = dto.document;
      cooperated.organization = dto.organization;
      return cooperated;
    });

    try {
      for (const dto of cooperatedEntities) {
        await queryRunner.manager.save(dto);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
