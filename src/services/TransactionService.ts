import { BankAccountId } from "@/types/Common";
import GlobalRegistry from "./GlobalRegistry";

class TransactionService {
  static transfer(
    fromBankAccountId: BankAccountId,
    toBankAccountId: BankAccountId,
    amount: number
  ) {
    const fromBankAccount = GlobalRegistry.getBankAccount(fromBankAccountId);
    const toBankAccount = GlobalRegistry.getBankAccount(toBankAccountId);

    if (!fromBankAccount) {
      throw new Error("`from` bank account not found.");
    }

    if (!toBankAccount) {
      throw new Error("`to` bank account not found.");
    }

    fromBankAccount.debit(amount);
    toBankAccount.credit(amount);
  }
}

export default TransactionService;
