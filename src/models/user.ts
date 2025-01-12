import GlobalRegistry from "@/services/GlobalRegistry";
import { BankAccountId, UserId } from "@/types/Common";

export interface IUser {
  getId(): UserId;
  getBankAccountIds(): BankAccountId[];
}

class User implements IUser {
  private id: UserId;
  private name: string;
  private bankAccountIds: BankAccountId[];

  constructor(name: string, bankAccountIds: BankAccountId[]) {
    this.id = this.generateUserId();
    this.name = name;
    this.bankAccountIds = bankAccountIds;

    GlobalRegistry.addUser(this);
  }

  static create(name: string, bankAccountIds: BankAccountId[]) {
    return new User(name, bankAccountIds);
  }

  private generateUserId(): UserId {
    return GlobalRegistry.nextId().toString();
  }

  getId(): UserId {
    return this.id;
  }

  getBankAccountIds(): BankAccountId[] {
    return [...this.bankAccountIds];
  }
}

export default User;
