import { TableStatus } from "@prisma/client";

export interface ICreateTable {
  status: TableStatus;
  startTime?: Date;
  endTime?: Date;
  areaId: string;
  name: string;
}

export interface IUpdateTable {
  status?: TableStatus;
  startTime?: Date;
  endTime?: Date;
  areaId?: string;
  name?: string;
}