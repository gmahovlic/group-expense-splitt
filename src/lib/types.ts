export interface Person {
  id: string
  name: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  paidBy: string
  type: 'shared' | 'individual'
  owedBy?: string
  timestamp: number
}

export interface Balance {
  personId: string
  name: string
  balance: number
}

export interface Settlement {
  from: string
  fromName: string
  to: string
  toName: string
  amount: number
}
