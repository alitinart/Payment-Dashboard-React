import { Transaction } from "./transactionModel";
export interface Store {
  _id: string;
  name: string;
  transactions: Transaction[];
  workers: { fullName: string; _id: string; status: string }[];
  status?: string;
  identifier: string;
  locations: [];
}
