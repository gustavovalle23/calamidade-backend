import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateReceiptDto } from "./dto/create-receipt.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ReceiptEntity } from "./entities/receipt.entity";
import { DeepPartial, Repository } from "typeorm";
import { RequestEntity } from "src/modules/request/entities/request.entity";
import { RequestStatusEnum } from "src/modules/request/enums/status.enum";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { NullableType } from "src/utils/types/nullable.type";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { ResourceNotFoundException } from "src/infrastructure/exceptions/resource-not-found.exception";

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(ReceiptEntity)
    private receiptRepository: Repository<ReceiptEntity>,
    @InjectRepository(RequestEntity)
    private requestRepository: Repository<RequestEntity>,
  ) {}

  async create(dto: CreateReceiptDto) {
    await this.validateAndUpdateRequest(dto);

    const receipt = this.receiptRepository.create(dto);
    return this.receiptRepository.save(receipt);
  }

  private async validateAndUpdateRequest(dto: CreateReceiptDto): Promise<RequestEntity> {
    const request = await this.requestRepository.findOne({
      where: { id: +dto.request },
    });

    if (!request) {
      throw new BadRequestException("Requisição não encontrada.");
    }

    if (request.statusId !== RequestStatusEnum.accepted) {
      throw new BadRequestException("Só é permitido adicionar recibos em solicitações deferidas.");
    }

    if (dto.provenValue > request.amount) {
      throw new BadRequestException("O valor comprovado não pode ser superior ao valor da solicitação.");
    }

    const existingReceipts = await this.receiptRepository.find({ where: { request: { id: +dto.request } } });
    const totalProvenValue = existingReceipts.reduce((sum, receipt) => sum + receipt.provenValue, 0);

    if (totalProvenValue + dto.provenValue > request.amount) {
      throw new BadRequestException("A soma dos valores comprovados de todos os recibos não pode exceder o valor total da solicitação.");
    }

    if (totalProvenValue + dto.provenValue === request.amount) {
      request.statusId = RequestStatusEnum.concluded;
      await this.requestRepository.save(request);
    }

    return request;
  }

  findManyWithPagination(paginationOptions: IPaginationOptions): Promise<ReceiptEntity[]> {
    return this.receiptRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  async findOne(fields: EntityCondition<ReceiptEntity>): Promise<NullableType<ReceiptEntity>> {
    const receipt = await this.receiptRepository.findOne({
      where: fields,
    });

    if (!receipt) {
      throw new ResourceNotFoundException();
    }

    return receipt;
  }

  update(id: ReceiptEntity["id"], payload: DeepPartial<ReceiptEntity>): Promise<ReceiptEntity> {
    return this.receiptRepository.save(
      this.receiptRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: ReceiptEntity["id"]): Promise<void> {
    await this.receiptRepository.softDelete(id);
  }
}
