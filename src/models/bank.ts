import { BankAccountId, BankId } from "@/types/Common";
import BankAccount, { IBankAccount } from "./bank-account";
import GlobalRegistry from "@/services/GlobalRegistry";

export interface IBank {
  getId(): BankId;
  createAccount(balance: number): IBankAccount;
}

export type BankOptions = {

};

class Bank implements IBank {
  private id: BankId;

  constructor() {
    this.id = this.generateBankId();
  }

  private generateBankId() {
    return GlobalRegistry.nextId().toString();
  }

  static create(): Bank {
    return new Bank();
  }

  getId(): BankId {
    return this.id;
  }

  createAccount(balance): BankAccount {
    const bankAccount = new BankAccount(balance);
    return bankAccount;
  }
}

export default Bank;
