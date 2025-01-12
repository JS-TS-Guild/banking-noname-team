import { Balance, BankAccountId, BankId, UserId } from "@/types/Common";
import BankAccount, { IBankAccount } from "./bank-account";
import GlobalRegistry from "@/services/GlobalRegistry";

export interface IBank {
  getId(): BankId;
  createAccount(balance: number): IBankAccount;
  getAccount(id: BankAccountId): IBankAccount;
  send(fromUserId: UserId, toUserId: UserId, amount: number, toBankId?: BankId): void;
}

export type BankOptions = {
  isNegativeAllowed?: boolean,
};

class Bank implements IBank {
  private id: BankId;
  private accounts: Map<BankAccountId, BankAccount>;
  private options: BankOptions;

  constructor(options?: BankOptions) {
    options ??= {
      isNegativeAllowed: false
    };

    this.options = options;
    this.id = this.generateBankId();
    this.accounts = new Map();

    GlobalRegistry.addBank(this);
  }

  static create(options?: BankOptions): Bank {
    return new Bank(options);
  }

  private generateBankId() {
    return GlobalRegistry.nextId().toString();
  }

  getId(): BankId {
    return this.id;
  }

  createAccount(balance: Balance): BankAccount {
    if(!this.options.isNegativeAllowed && balance < 0) {
      throw new Error("Negative balance is not allowed by this bank.");
    }

    const bankAccount = new BankAccount(this.getId(), balance);
    this.accounts.set(bankAccount.getId(), bankAccount);
    return bankAccount;
  }

  getAccount(id: BankAccountId): IBankAccount {
    const account: BankAccount | undefined
      = this.accounts.get(id);

    if(!account) {
      throw new Error("Account not found.");
    }

    return account;
  }

  send(fromUserId: UserId, toUserId: UserId, amount: number, toBankId?: BankId): void {
    const fromBankAccount = GlobalRegistry.findBankAccountByUser(fromUserId, this.getId());
    if(!fromBankAccount) {
      throw new Error("`from` account not found.");
    }
    
    const toBankAccount = GlobalRegistry.findBankAccountByUser(toUserId, toBankId || this.getId());
    if(!toBankAccount) {
      throw new Error("`to` account not found.");
    }

    const isNegativeAllowed = this.options.isNegativeAllowed;

    const updatedFromBalance = fromBankAccount.getBalance() - amount;
    const updatedToBalance = toBankAccount.getBalance() + amount;

    if(!isNegativeAllowed && updatedFromBalance < 0) {
      throw new Error("Insufficient funds");
    }

    fromBankAccount.setBalance(updatedFromBalance);
    toBankAccount.setBalance(updatedToBalance);
  }
}

export default Bank;
