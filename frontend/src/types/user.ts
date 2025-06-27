import { type Transaction } from 'types/transaction';

export interface User {
  readonly id: string;
  email: string;
  name: string;
  created_at: Date | string;
  avatar: string | null;
  transactions: Transaction[];
}
