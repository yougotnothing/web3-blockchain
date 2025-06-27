import { action, makeObservable, observable } from 'mobx';
import type { Transaction } from 'types/transaction';

abstract class User {
  public name: string = '';
  public email: string = '';
  private id: string = '';
  public avatar: string | null = null;
  public transactions: Transaction[] = [];
  public created_at: string | Date = '';

  private setId(id: string) {
    this.id = id;
  }
}

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
}

export const userStore = new UserStore();
