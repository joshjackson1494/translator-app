import { StatusCodes } from "http-status-codes";

export type APIResponse<T = any> = {
  status: StatusCodes;
  data?: T;
  error?: string | string[];
};
