export interface Account {
  id: string
  name: string
  currency: "EUR" | "RON"
  balance: number
  accountNumber: string
  type: "checking" | "savings"
}

export interface Transaction {
  id: string
  accountId: string
  type: "deposit" | "withdrawal" | "transfer"
  amount: number
  currency: "EUR" | "RON"
  description: string
  date: Date
  recipient?: string
}

export interface Card {
  id: string
  accountId: string
  cardNumber: string
  holderName: string
  expiryDate: string
  cvv: string
  type: "debit"
  status: "active" | "blocked"
}

export interface Bill {
  id: string
  name: string
  amount: number
  currency: "EUR" | "RON"
  dueDate: Date
  status: "paid" | "pending" | "overdue"
  category: string
}

export interface Loan {
  id: string
  amount: number
  currency: "EUR" | "RON"
  interestRate: number
  term: number
  monthlyPayment: number
  status: "active" | "pending" | "completed"
  startDate: Date
}

export interface SupportMessage {
  id: string
  message: string
  date: Date
  status: "sent" | "replied"
  reply?: string
}

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    accountId: "1",
    type: "deposit",
    amount: 2500.0,
    currency: "EUR",
    description: "Salary",
    date: new Date("2025-01-02"),
  },
  {
    id: "2",
    accountId: "1",
    type: "withdrawal",
    amount: 150.25,
    currency: "EUR",
    description: "Grocery Shopping",
    date: new Date("2025-01-03"),
  },
  {
    id: "3",
    accountId: "1",
    type: "transfer",
    amount: 500.0,
    currency: "EUR",
    description: "Transfer to Savings",
    date: new Date("2025-01-03"),
    recipient: "Savings Account",
  },
  {
    id: "4",
    accountId: "1",
    type: "withdrawal",
    amount: 45.8,
    currency: "EUR",
    description: "Restaurant",
    date: new Date("2024-12-28"),
  },
  {
    id: "5",
    accountId: "1",
    type: "withdrawal",
    amount: 89.9,
    currency: "EUR",
    description: "Online Shopping",
    date: new Date("2024-12-25"),
  },
  {
    id: "6",
    accountId: "2",
    type: "deposit",
    amount: 500.0,
    currency: "EUR",
    description: "Transfer from Main",
    date: new Date("2025-01-03"),
  },
]

export const mockCards: Card[] = [
  {
    id: "1",
    accountId: "1",
    cardNumber: "4532 **** **** 1234",
    holderName: "John Doe",
    expiryDate: "12/27",
    cvv: "123",
    type: "debit",
    status: "active",
  },
]

export const mockBills: Bill[] = [
  {
    id: "1",
    name: "Electricity Bill",
    amount: 120.5,
    currency: "EUR",
    dueDate: new Date("2025-01-15"),
    status: "pending",
    category: "Utilities",
  },
  {
    id: "2",
    name: "Internet & TV",
    amount: 45.0,
    currency: "EUR",
    dueDate: new Date("2025-01-20"),
    status: "pending",
    category: "Utilities",
  },
  {
    id: "3",
    name: "Phone Bill",
    amount: 25.0,
    currency: "EUR",
    dueDate: new Date("2024-12-30"),
    status: "paid",
    category: "Utilities",
  },
]

export const mockLoans: Loan[] = [
  {
    id: "1",
    amount: 15000.0,
    currency: "EUR",
    interestRate: 5.5,
    term: 60,
    monthlyPayment: 285.0,
    status: "active",
    startDate: new Date("2024-06-01"),
  },
]

export const mockSupportMessages: SupportMessage[] = [
  {
    id: "1",
    message: "I need help with my card activation",
    date: new Date("2024-12-28"),
    status: "replied",
    reply: "Your card has been activated successfully. You can start using it now.",
  },
]

export const currencySymbols = {
  EUR: "€",
  RON: "lei",
}
