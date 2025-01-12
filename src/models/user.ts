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
    this.id = GlobalRegistry.nextId().toString();
    this.name = name;
    this.bankAccountIds = bankAccountIds;
  }

  static create(name: string, bankAccountIds: BankAccountId[]) {
    return new User(name, bankAccountIds);
  }

  getId(): UserId {
    return this.id;
  }
}

export default User;
