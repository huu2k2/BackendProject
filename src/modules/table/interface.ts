import { TableStatus } from "@prisma/client";

export interface CreateTableDto {
  status: TableStatus;
  startTime?: Date;
  endTime?: Date;
  areaId: string;
  name: string;
}

export interface UpdateTableDto {
  status?: TableStatus;
  startTime?: Date;
  endTime?: Date;
  areaId?: string;
  name?: string;
}