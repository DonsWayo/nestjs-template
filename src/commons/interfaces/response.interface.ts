export interface IResponse{
    success: boolean;
    message: string | string[];
    errorMessage: string | string[];
    data: any[];
    error: any;
  }