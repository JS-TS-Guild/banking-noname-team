import { Balance, BankAccountId, BankId, UserId } from "@/types/Common";
import BankAccount, { IBankAccount } from "./bank-account";
import GlobalRegistry from "@/services/GlobalRegistry";
import TransactionService from "@/services/TransactionService";

export interface IBank {
  getId(): BankId;
  createAccount(balance: number): IBankAccount;
  getAccount(id: BankAccountId): IBankAccount;
  send(
    fromUserId: UserId,
    toUserId: UserId,
    amount: number,
    toBankId?: BankId
  ): void;
}

export type BankOptions = {
  isNegativeAllowed?: boolean;
};

class Bank implements IBank {
  private id: BankId;
  private accounts: Map<BankAccountId, BankAccount>;
  private options: BankOptions;

  private static counter: number = 1;

  private constructor(options?: BankOptions) {
    options ??= {
      isNegativeAllowed: false,
    };

    this.options = options;
    this.id = this.generateNewId();
    this.accounts = new Map();

    GlobalRegistry.addBank(this);
  }

  static create(options?: BankOptions): Bank {
    return new Bank(options);
  }

  private generateNewId() {
    const nextId = Bank.counter;
    ++Bank.counter;

    return nextId.toString();
  }

  getId(): BankId {
    return this.id;
  }

  createAccount(balance: Balance): BankAccount {
    if (!this.options.isNegativeAllowed && balance < 0) {
      throw new Error("Negative balance is not allowed by this bank.");
    }

    const bankAccount = BankAccount.create(
      this.getId(),
      balance,
      this.options.isNegativeAllowed || false
    );
    this.accounts.set(bankAccount.getId(), bankAccount);
    return bankAccount;
  }

  getAccount(id: BankAccountId): IBankAccount {
    const account: BankAccount | undefined = this.accounts.get(id);

    if (!account) {
      throw new Error("Account not found.");
    }

    return account;
  }

  private findBankAccountsByUserAndBank(
    userId: UserId,
    bankId: BankAccountId
  ): IBankAccount[] {
    const user = GlobalRegistry.getUser(userId);
    if (!user) {
      return;
    }

    const bankAccounts = user
      .getBankAccountIds()
      .map((id) => GlobalRegistry.getBankAccount(id));

    let foundBankAccounts: IBankAccount[] = bankAccounts.filter((account) => {
      if (account && account.getBankId() === bankId) {
        return true;
      }
    });

    return foundBankAccounts;
  }

  send(
    fromUserId: UserId,
    toUserId: UserId,
    amount: number,
    toBankId?: BankId
  ): void {
    if (amount <= 0) {
      throw new Error("Invalid amount. Must be a positive number.");
    }

    const fromBankAccounts = this.findBankAccountsByUserAndBank(
      fromUserId,
      this.getId()
    );
    if (fromBankAccounts.length === 0) {
      throw new Error("`from` account not found.");
    }

    const toBankAccounts = this.findBankAccountsByUserAndBank(
      toUserId,
      toBankId || this.getId()
    );
    if (toBankAccounts.length === 0) {
      throw new Error("`to` account not found.");
    }

    let fromBankAccount: IBankAccount | undefined;
    const toBankAccount = toBankAccounts[0];

    for (const account of fromBankAccounts) {
      const updatedFromBalance = account.getBalance() - amount;

      if (updatedFromBalance < 0 && !account.isNegativeBalanceAllowed()) {
        continue;
      }

      fromBankAccount = account;
      break;
    }

    if (!fromBankAccount) {
      throw new Error(
        `Insufficient funds. ${amount} => Accounts: ${fromBankAccounts
          .map((x) => {
            return `${x.getId()} => ${x.getBalance()} (isNegativeAllowed: ${x.isNegativeBalanceAllowed()})`;
          })
          .join("\n")}`
      );
    }

    TransactionService.transfer(
      fromBankAccount.getId(),
      toBankAccount.getId(),
      amount
    );

    const fromUser = GlobalRegistry.getUser(fromUserId);
    const toUser = GlobalRegistry.getUser(toUserId);

    fromUser.updateAccountsList();
    toUser.updateAccountsList();
  }
}

export default Bank;
