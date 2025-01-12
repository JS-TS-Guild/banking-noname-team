import GlobalRegistry from "@/services/GlobalRegistry";
import { BankAccountId, UserId } from "@/types/Common";

export interface IUser {
  getId(): UserId;
}

class User implements IUser {
  private id: UserId;
  private name: string;
  private bankAccountIds: BankAccountId[];

  constructor(name: string, bankAccountIds: BankAccountId[]) {
    this.id = this.generateUserId();
    this.name = name;
    this.bankAccountIds = bankAccountIds;
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
}

export default User;
