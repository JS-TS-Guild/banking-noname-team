import { IBank } from "@/models/bank";
import { IBankAccount } from "@/models/bank-account";
import { IUser } from "@/models/user";

import { BankAccountId, BankId, UserId } from "@/types/Common";

class GlobalRegistry {
  static counter: number = 1;

  static banks: Map<BankId, IBank> = new Map();
  static bankAccounts: Map<BankAccountId, IBankAccount> = new Map();
  static users: Map<UserId, IUser> = new Map();

  static clear() {
    this.counter = 1;
    this.banks = new Map();
    this.bankAccounts = new Map();
    this.users = new Map();
  }

  static addBank(bank: IBank): void {
    this.banks.set(bank.getId(), bank);
  }
  
  static addBankAccount(bankAccount: IBankAccount): void {
    this.bankAccounts.set(bankAccount.getId(), bankAccount);
  }

  static addUser(user: IUser): void {
    this.users.set(user.getId(), user);
  }

  static getBank(id: BankId): IBank | undefined {
    return this.banks.get(id);
  }

  static getBankAccount(id: BankAccountId): IBankAccount | undefined {
    return this.bankAccounts.get(id);
  }

  static getUser(id: UserId): IUser | undefined {
    return this.users.get(id);
  }

  static findBankAccountByUser(userId: UserId, bankId: BankAccountId): IBankAccount | undefined {
    const user = this.users.get(userId);
    if(!user) {
      return;
    }

    const bankAccounts = user
      .getBankAccountIds()
      .map(id => this.bankAccounts.get(id));
    
    let bankAccount: IBankAccount | undefined;
    for(const account of bankAccounts) {
      if(account && account.getBankId() === bankId) {
        bankAccount = account;
        break;
      }
    }

    if(!bankAccount) {
      return;
    }

    return bankAccount;
  }
  

  static nextId() {
    const nextId = this.counter;
    ++this.counter;

    return nextId;
  }
}

export default GlobalRegistry;
