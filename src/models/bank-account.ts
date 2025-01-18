import GlobalRegistry from "@/services/GlobalRegistry";
import { BankAccountId, Balance, BankId } from "@/types/Common";

export interface IBankAccount {
  getId(): BankAccountId;
  getBankId(): BankId;
  isNegativeBalanceAllowed(): boolean;
  getBalance(): Balance;
  setBalance(balance: Balance): void;

  canDebit(amount: number): boolean;

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
  private allowNegativeBalance: boolean;

  private static counter: number = 1;

  private constructor(
    bankId: BankId,
    balance: Balance,
    allowNegativeBalance: boolean
  ) {
    this.id = this.generateNewId();
    this.bankId = bankId;
    this.balance = balance;
    this.allowNegativeBalance = allowNegativeBalance;

    this.createdAt = new Date();
    this.updatedAt = new Date(this.createdAt);
  }

  static create(
    bankId: BankId,
    balance: Balance,
    allowNegativeBalance: boolean = false
  ) {
    if (balance < 0 && !allowNegativeBalance) {
      throw new Error(
        "Cannot create account with a negative balance, when negative balance is now allowed."
      );
    }
    const account = new BankAccount(bankId, balance, allowNegativeBalance);
    GlobalRegistry.addBankAccount(account);
    return account;
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

  isNegativeBalanceAllowed(): boolean {
    return this.allowNegativeBalance;
  }

  canDebit(amount: number): boolean {
    return this.allowNegativeBalance || this.balance >= amount;
  }

  debit(amount: number) {
    this.balance -= amount;
  }

  credit(amount: number) {
    this.balance += amount;
  }
}

export default BankAccount;
