import { useMemo, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Person, Expense } from '@/lib/types'
import { calculateBalances, calculateSettlements } from '@/lib/calculations'
import { AddPersonDialog } from '@/components/AddPersonDialog'
import { AddExpenseDialog } from '@/components/AddExpenseDialog'
import { EditPersonDialog } from '@/components/EditPersonDialog'
import { DeletePersonDialog } from '@/components/DeletePersonDialog'
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

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<{ id: string; name: string } | null>(null)

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

  const handleEditPerson = (personId: string, name: string) => {
    setSelectedPerson({ id: personId, name })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = (personId: string, newName: string) => {
    setPeople((current) => 
      (current || []).map(p => 
        p.id === personId ? { ...p, name: newName } : p
      )
    )
    toast.success('Person updated successfully')
  }

  const handleDeletePerson = (personId: string, name: string) => {
    setSelectedPerson({ id: personId, name })
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedPerson) {
      setPeople((current) => (current || []).filter(p => p.id !== selectedPerson.id))
      setExpenses((current) => 
        (current || []).filter(e => 
          e.paidBy !== selectedPerson.id && e.owedBy !== selectedPerson.id
        )
      )
      toast.success(`${selectedPerson.name} removed from the group`)
      setSelectedPerson(null)
    }
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
      <EditPersonDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        personId={selectedPerson?.id || ''}
        currentName={selectedPerson?.name || ''}
        onEdit={handleSaveEdit}
      />
      <DeletePersonDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        personName={selectedPerson?.name || ''}
        onConfirm={handleConfirmDelete}
      />
      <div className="min-h-screen bg-background">
        <div className="mx-auto px-4 py-4 sm:py-8 max-w-7xl">
          <header className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 font-[family-name:var(--font-space-grotesk)]">
              SplitWise
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Fair expense splitting made simple
            </p>
          </header>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users weight="fill" size={24} className="text-primary flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-semibold font-[family-name:var(--font-space-grotesk)]">
                      Group Members
                    </h2>
                  </div>
                  <div className="flex gap-2 flex-wrap">
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
                  <div className="grid gap-3">
                    {balances.map((balance, index) => (
                      <BalanceCard 
                        key={balance.personId} 
                        balance={balance} 
                        index={index}
                        onEdit={handleEditPerson}
                        onDelete={handleDeletePerson}
                      />
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt weight="fill" size={24} className="text-primary flex-shrink-0" />
                  <h2 className="text-xl sm:text-2xl font-semibold font-[family-name:var(--font-space-grotesk)]">
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
              <Card className="p-4 sm:p-6 lg:sticky lg:top-4">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 font-[family-name:var(--font-space-grotesk)]">
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