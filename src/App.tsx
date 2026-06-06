import { useMemo, useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { Person, Expense, Transaction } from '@/lib/types'
import { calculateBalances, calculateSettlements } from '@/lib/calculations'
import { AddPersonDialog } from '@/components/AddPersonDialog'
import { AddExpenseDialog } from '@/components/AddExpenseDialog'
import { AddTransactionDialog } from '@/components/AddTransactionDialog'
import { EditPersonDialog } from '@/components/EditPersonDialog'
import { DeletePersonDialog } from '@/components/DeletePersonDialog'
import { PersonHistoryDialog } from '@/components/PersonHistoryDialog'
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
  const [transactions, setTransactions] = useKV<Transaction[]>('transactions-list', [])
  const [isLoaded, setIsLoaded] = useState(false)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const safePeople = people ?? []
  const safeExpenses = expenses ?? []
  const safeTransactions = transactions ?? []

  const handleAddPerson = useCallback((name: string) => {
    const newPerson: Person = {
      id: `person-${Date.now()}`,
      name
    }
    setPeople((current) => [...(current ?? []), newPerson])
    toast.success(`${name} added to the group`)
  }, [setPeople])

  const handleEditPerson = useCallback((personId: string, name: string) => {
    setSelectedPerson({ id: personId, name })
    setEditDialogOpen(true)
  }, [])

  const handleSaveEdit = useCallback((personId: string, newName: string) => {
    setPeople((current) => 
      (current ?? []).map(p => 
        p.id === personId ? { ...p, name: newName } : p
      )
    )
    toast.success('Person updated successfully')
  }, [setPeople])

  const handleDeletePerson = useCallback((personId: string, name: string) => {
    setSelectedPerson({ id: personId, name })
    setDeleteDialogOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (selectedPerson) {
      const personIdToDelete = selectedPerson.id
      const personNameToDelete = selectedPerson.name
      
      setPeople((current) => (current ?? []).filter(p => p.id !== personIdToDelete))
      setExpenses((current) => 
        (current ?? []).filter(e => 
          e.paidBy !== personIdToDelete && e.owedBy !== personIdToDelete
        )
      )
      setTransactions((current) => 
        (current ?? []).filter(t => 
          t.from !== personIdToDelete && t.to !== personIdToDelete
        )
      )
      toast.success(`${personNameToDelete} removed from the group`)
      setSelectedPerson(null)
    }
  }, [selectedPerson, setPeople, setExpenses, setTransactions])

  const handleViewHistory = useCallback((personId: string, name: string) => {
    setSelectedPerson({ id: personId, name })
    setHistoryDialogOpen(true)
  }, [])

  const handleAddExpense = useCallback((
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
    setExpenses((current) => [...(current ?? []), newExpense])
    toast.success('Expense added successfully')
  }, [setExpenses])

  const handleDeleteExpense = useCallback((expenseId: string) => {
    setExpenses((current) => (current ?? []).filter(e => e.id !== expenseId))
    toast.success('Expense deleted')
  }, [setExpenses])

  const handleDeleteTransaction = useCallback((transactionId: string) => {
    setTransactions((current) => (current ?? []).filter(t => t.id !== transactionId))
    toast.success('Transaction deleted')
  }, [setTransactions])

  const handleAddTransaction = useCallback((from: string, to: string, amount: number, note?: string) => {
    const newTransaction: Transaction = {
      id: `transaction-${Date.now()}`,
      from,
      to,
      amount,
      note,
      timestamp: Date.now()
    }
    setTransactions((current) => [...(current ?? []), newTransaction])
    const fromPerson = safePeople.find(p => p.id === from)
    const toPerson = safePeople.find(p => p.id === to)
    toast.success(`Payment recorded: ${fromPerson?.name} → ${toPerson?.name}`)
  }, [setTransactions, safePeople])

  const balances = useMemo(() => calculateBalances(safePeople, safeExpenses, safeTransactions), [safePeople, safeExpenses, safeTransactions])
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
      <PersonHistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        person={selectedPerson ? { id: selectedPerson.id, name: selectedPerson.name } : null}
        expenses={safeExpenses}
        transactions={safeTransactions}
        people={safePeople}
        onDeleteExpense={handleDeleteExpense}
        onDeleteTransaction={handleDeleteTransaction}
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
                    <AddTransactionDialog people={safePeople} onAddTransaction={handleAddTransaction} />
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
                        onClick={handleViewHistory}
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
                  transactions={safeTransactions}
                  people={safePeople}
                  onDeleteExpense={handleDeleteExpense}
                  onDeleteTransaction={handleDeleteTransaction}
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