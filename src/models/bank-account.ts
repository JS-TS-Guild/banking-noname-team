import GlobalRegistry from "@/services/GlobalRegistry";
import { BankAccountId, Balance } from "@/types/Common";

export interface IBankAccount {
  getId(): BankAccountId;
}

class BankAccount implements IBankAccount {
  private id: BankAccountId;
  private balance: Balance;
  
  constructor(balance: Balance) {
    this.id = this.generateBankAccountId();
  }

  private generateBankAccountId() {
    return GlobalRegistry.nextId().toString();
  }

  getId(): BankAccountId {
    return this.id
  }
}

export default BankAccount;
