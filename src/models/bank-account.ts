import GlobalRegistry from "@/services/GlobalRegistry";
import { BankAccountId, Balance, BankId } from "@/types/Common";

export interface IBankAccount {
  getId(): BankAccountId;
  getBankId(): BankId;
  getBalance(): Balance;
  setBalance(balance: Balance): void;
}

class BankAccount implements IBankAccount {
  private id: BankAccountId;
  private bankId: BankId;
  private balance: Balance;
  
  constructor(bankId: BankId, balance: Balance) {
    this.id = this.generateBankAccountId();
    this.bankId = bankId;
    this.balance = balance;

    GlobalRegistry.addBankAccount(this);
  }

  private generateBankAccountId() {
    return GlobalRegistry.nextId().toString();
  }

  getId(): BankAccountId {
    return this.id
  }

  getBankId(): BankId {
    return this.bankId;
  }

  getBalance() {
    return this.balance;
  }

  setBalance(balance: Balance) {
    this.balance = balance;
  }
}

export default BankAccount;
