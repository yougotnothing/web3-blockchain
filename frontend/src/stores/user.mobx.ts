import { action, makeObservable, observable } from 'mobx';
import type { Transaction } from 'types/transaction';
import api from 'api';

class UserStore {
  @observable public name: string = '';
  @observable public email: string = '';
  @observable private id: string = '';
  @observable public avatar: string | null = null;
  @observable public transactions: Transaction[] = [];
  @observable public created_at: string | Date = '';

  constructor() {
    makeObservable(this);
  }

  @action
  private setId(id: string) {
    this.id = id;
  }

  @action
  private setName(name: string) {
    this.name = name;
  }

  @action
  private setEmail(email: string) {
    this.email = email;
  }

  @action
  private setAvatar(avatar: string) {
    this.avatar = avatar;
  }

  @action
  private setTransactions(transactions: Transaction[]) {
    this.transactions = transactions;
  }

  @action
  private setCreatedAt(created_at: string | Date) {
    this.created_at = created_at;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  @action.bound
  public async getTransactions(): Promise<void> {
    try {
      const response = await api.get(`transactions/${this.id}`);
      this.setTransactions(response.data);
    } catch (error: any) {
      console.error(error.response.data);
    }
  }

  @action.bound
  public async getSelf(): Promise<void> {
    try {
      const response = await api.get('user/self');

      this.setId(response.data.id);
      this.setName(response.data.name);
      this.setEmail(response.data.email);
      this.setAvatar(response.data.avatar);
      this.setTransactions(response.data.transactions);
      this.setCreatedAt(response.data.created_at);
    } catch (error: any) {
      console.error(error.response.data);
    }
  }
}

export const user = new UserStore();
