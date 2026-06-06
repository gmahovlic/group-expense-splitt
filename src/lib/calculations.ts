import { Balance, Person, Expense, Settlement, Transaction } from './types'

export function calculateBalances(people: Person[], expenses: Expense[], transactions: Transaction[] = []): Balance[] {
  const balances = new Map<string, number>()
  
  people.forEach(person => {
    balances.set(person.id, 0)
  })

  expenses.forEach(expense => {
    const payer = expense.paidBy
    
    if (expense.type === 'shared') {
      const share = expense.amount / people.length
      
      people.forEach(person => {
        if (person.id === payer) {
          balances.set(person.id, (balances.get(person.id) || 0) + expense.amount - share)
        } else {
          balances.set(person.id, (balances.get(person.id) || 0) - share)
        }
      })
    } else if (expense.type === 'individual' && expense.owedBy) {
      const owedBy = expense.owedBy
      
      if (payer === owedBy) {
        return
      }
      
      balances.set(payer, (balances.get(payer) || 0) + expense.amount)
      balances.set(owedBy, (balances.get(owedBy) || 0) - expense.amount)
    }
  })

  transactions.forEach(transaction => {
    balances.set(transaction.to, (balances.get(transaction.to) || 0) + transaction.amount)
    balances.set(transaction.from, (balances.get(transaction.from) || 0) - transaction.amount)
  })

  return people.map(person => ({
    personId: person.id,
    name: person.name,
    balance: Math.round((balances.get(person.id) || 0) * 100) / 100
  }))
}

export function calculateSettlements(balances: Balance[]): Settlement[] {
  const settlements: Settlement[] = []
  
  const creditors = balances
    .filter(b => b.balance > 0.01)
    .map(b => ({ ...b }))
    .sort((a, b) => b.balance - a.balance)
  
  const debtors = balances
    .filter(b => b.balance < -0.01)
    .map(b => ({ ...b, balance: -b.balance }))
    .sort((a, b) => b.balance - a.balance)
  
  let i = 0
  let j = 0
  
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i]
    const debtor = debtors[j]
    
    const amount = Math.min(creditor.balance, debtor.balance)
    
    if (amount > 0.01) {
      settlements.push({
        from: debtor.personId,
        fromName: debtor.name,
        to: creditor.personId,
        toName: creditor.name,
        amount: Math.round(amount * 100) / 100
      })
    }
    
    creditor.balance -= amount
    debtor.balance -= amount
    
    if (creditor.balance < 0.01) {
      i++
    }
    if (debtor.balance < 0.01) {
      j++
    }
  }
  
  return settlements
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}
