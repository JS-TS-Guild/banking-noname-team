import GlobalRegistry from "@/services/GlobalRegistry";
import { BankAccountId, Balance, BankId } from "@/types/Common";

export interface IBankAccount {
  getId(): BankAccountId;
  getBankId(): BankId;
  getBalance(): Balance;
  setBalance(balance: Balance): void;

  debit(amount: number): void;
  credit(amount: number): void;

  getCreatedAt(): Date;
  getUpdatedAt(): Date;
}

class BankAccount implements IBankAccount {
  private id: BankAccountId;
  private bankId: BankId;
  private balance: Balance;
  private createdAt: Date;
  private updatedAt: Date;

  private static counter: number = 1;

  private constructor(bankId: BankId, balance: Balance) {
    this.id = this.generateNewId();
    this.bankId = bankId;
    this.balance = balance;

    this.createdAt = new Date();
    this.updatedAt = new Date(this.createdAt);

    GlobalRegistry.addBankAccount(this);
  }

  static create(bankId: BankId, balance: Balance) {
    return new BankAccount(bankId, balance);
  }

  private generateNewId() {
    const nextId = BankAccount.counter;
    ++BankAccount.counter;

    return nextId.toString();
  }

  getId(): BankAccountId {
    return this.id;
  }

  getBankId(): BankId {
    return this.bankId;
  }

  getBalance() {
    return this.balance;
  }

  setBalance(balance: Balance) {
    this.balance = balance;
    this.updatedAt = new Date();
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  debit(amount: number) {
    this.balance -= amount;
  }

  credit(amount: number) {
    this.balance += amount;
  }
}

export default BankAccount;
