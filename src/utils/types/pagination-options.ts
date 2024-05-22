import { OrderingEnum } from "src/modules/request/enums/ordering-filter.enum";
import { WhereExpressionBuilder } from "typeorm";

export interface IPaginationOptions {
  page: number;
  limit: number;
  ordering?: OrderingEnum;
  where?: object | null
}
