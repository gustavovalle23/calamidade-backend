import { OrderingEnum } from "src/modules/request/enums/ordering-filter.enum";

export interface IPaginationOptions {
  page: number;
  limit: number;
  ordering?: OrderingEnum
}
