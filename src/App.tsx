import { useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Person, Expense } from '@/lib/types'
import { calculateBalances, calculateSettlements } from '@/lib/calculations'
import { AddPersonDialog } from '@/components/AddPersonDialog'
import { AddExpenseDialog } from '@/components/AddExpenseDialog'
import { BalanceCard } from '@/components/BalanceCard'
import { SettlementsList } from '@/components/SettlementsList'
import { ExpenseHistory } from '@/components/ExpenseHistory'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Toaster, toast } from 'sonner'
import { Users, Receipt } from '@phosphor-icons/react'

function App() {
  const [people, setPeople] = useKV<Person[]>('expense-people', [])
  const [expenses, setExpenses] = useKV<Expense[]>('expense-list', [])

  const safePeople = people || []
  const safeExpenses = expenses || []

  const handleAddPerson = (name: string) => {
    const newPerson: Person = {
      id: `person-${Date.now()}`,
      name
    }
    setPeople((current) => [...(current || []), newPerson])
    toast.success(`${name} added to the group`)
  }

  const handleAddExpense = (
    description: string,
    amount: number,
    paidBy: string,
    type: 'shared' | 'individual',
    owedBy?: string
  ) => {
    const newExpense: Expense = {
      id: `expense-${Date.now()}`,
      description,
      amount,
      paidBy,
      type,
      owedBy,
      timestamp: Date.now()
    }
    setExpenses((current) => [...(current || []), newExpense])
    toast.success('Expense added successfully')
  }

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses((current) => (current || []).filter(e => e.id !== expenseId))
    toast.success('Expense deleted')
  }

  const balances = useMemo(() => calculateBalances(safePeople, safeExpenses), [safePeople, safeExpenses])
  const settlements = useMemo(() => calculateSettlements(balances), [balances])

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2 font-[family-name:var(--font-space-grotesk)]">
              SplitWise
            </h1>
            <p className="text-muted-foreground text-lg">
              Fair expense splitting made simple
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users weight="fill" size={24} className="text-primary" />
                    <h2 className="text-2xl font-semibold font-[family-name:var(--font-space-grotesk)]">
                      Group Members
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <AddPersonDialog onAddPerson={handleAddPerson} />
                    <AddExpenseDialog people={safePeople} onAddExpense={handleAddExpense} />
                  </div>
                </div>

                {safePeople.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No members yet. Add people to start splitting expenses.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {balances.map((balance, index) => (
                      <BalanceCard key={balance.personId} balance={balance} index={index} />
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt weight="fill" size={24} className="text-primary" />
                  <h2 className="text-2xl font-semibold font-[family-name:var(--font-space-grotesk)]">
                    Settlement Plan
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  The most efficient way to settle all debts
                </p>
                <Separator className="mb-4" />
                <SettlementsList settlements={settlements} />
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-space-grotesk)]">
                  Expense History
                </h2>
                <Separator className="mb-4" />
                <ExpenseHistory
                  expenses={safeExpenses}
                  people={safePeople}
                  onDeleteExpense={handleDeleteExpense}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App