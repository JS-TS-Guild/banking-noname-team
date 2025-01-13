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
  
  private static counter: number = 1;

  constructor(name: string, bankAccountIds: BankAccountId[]) {
    this.id = this.generateNewId();
    this.name = name;
    this.bankAccountIds = bankAccountIds;

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
}

export default User;
