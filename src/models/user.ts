import GlobalRegistry from "@/services/GlobalRegistry";
import { BankAccountId, UserId } from "@/types/Common";
import { IBankAccount } from "./bank-account";

export interface IUser {
  getId(): UserId;
  getBankAccountIds(): BankAccountId[];
  updateAccountsList(): void;
}

class User implements IUser {
  private id: UserId;
  private name: string;
  private bankAccountIds: BankAccountId[];

  private static counter: number = 1;

  private constructor(name: string, bankAccountIds: BankAccountId[]) {
    this.id = this.generateNewId();
    this.name = name;
    this.bankAccountIds = bankAccountIds;

    this.updateAccountsList();

    GlobalRegistry.addUser(this);
  }

  static create(name: string, bankAccountIds: BankAccountId[]) {
    return new User(name, bankAccountIds);
  }

  private generateNewId() {
    const nextId = User.counter;
    ++User.counter;

    return nextId.toString();
  }

  getId(): UserId {
    return this.id;
  }

  getBankAccountIds(): BankAccountId[] {
    return [...this.bankAccountIds];
  }

  updateAccountsList(): void {
    const newAccountsList = this.bankAccountIds
      .map((bankAccountId) => {
        return GlobalRegistry.getBankAccount(bankAccountId);
      })
      .sort((a: IBankAccount, b: IBankAccount) => {
        return a.getUpdatedAt().getTime() - b.getUpdatedAt().getTime();
      })
      .map((account) => account.getId());

    this.bankAccountIds = newAccountsList;
  }
}

export default User;
