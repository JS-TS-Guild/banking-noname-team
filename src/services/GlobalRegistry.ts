import { BankId } from "@/types/Common";

class GlobalRegistry {
  static counter: number = 1;

  static clear() {
    this.counter = 1;
  }

  static nextId() {
    const nextId = this.counter;
    ++this.counter;

    return nextId;
  }
}

export default GlobalRegistry;
