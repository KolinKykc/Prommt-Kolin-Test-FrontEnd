import { Status } from '../enum/status.enum';

export interface Payment {
  id: number;
  payer_email: string;
  status: Status;
  currency: string;
  created_date: Date;
  paid_date: Date;
  amount: number;

}
