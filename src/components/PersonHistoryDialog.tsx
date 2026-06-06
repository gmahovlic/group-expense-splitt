import { Person, Expense, Transaction } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Receipt, CurrencyDollar, Trash } from '@phosphor-icons/react'
import { format } from 'date-fns'

interface PersonHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: Person | null
  expenses: Expense[]
  transactions: Transaction[]
  people: Person[]
  onDeleteExpense: (expenseId: string) => void
  onDeleteTransaction: (transactionId: string) => void
}

export function PersonHistoryDialog({
  open,
  onOpenChange,
  person,
  expenses,
  transactions,
  people,
  onDeleteExpense,
  onDeleteTransaction
}: PersonHistoryDialogProps) {
  if (!person) return null

  const getPersonName = (id: string) => {
    return people.find(p => p.id === id)?.name || 'Unknown'
  }

  const personExpenses = expenses.filter(
    e => e.paidBy === person.id || (e.type === 'individual' && e.owedBy === person.id)
  )

  const personTransactions = transactions.filter(
    t => t.from === person.id || t.to === person.id
  )

  const allItems = [
    ...personExpenses.map(e => ({ type: 'expense' as const, data: e, timestamp: e.timestamp })),
    ...personTransactions.map(t => ({ type: 'transaction' as const, data: t, timestamp: t.timestamp }))
  ].sort((a, b) => b.timestamp - a.timestamp)

  const totalPaid = expenses
    .filter(e => e.paidBy === person.id)
    .reduce((sum, e) => sum + e.amount, 0)

  const totalOwed = expenses
    .filter(e => e.type === 'individual' && e.owedBy === person.id)
    .reduce((sum, e) => sum + e.amount, 0)

  const totalSharedExpenses = expenses
    .filter(e => e.type === 'shared')
    .reduce((sum, e) => sum + e.amount / people.length, 0)

  const transactionsSent = transactions
    .filter(t => t.from === person.id)
    .reduce((sum, t) => sum + t.amount, 0)

  const transactionsReceived = transactions
    .filter(t => t.to === person.id)
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-[family-name:var(--font-space-grotesk)]">
            {person.name}'s History
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4 grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
            <p className="text-lg font-bold font-mono text-positive">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Personal Expenses</p>
            <p className="text-lg font-bold font-mono text-destructive">{formatCurrency(totalOwed)}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Shared Expenses</p>
            <p className="text-lg font-bold font-mono text-muted-foreground">{formatCurrency(totalSharedExpenses)}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Net Payments</p>
            <p className={`text-lg font-bold font-mono ${transactionsReceived - transactionsSent >= 0 ? 'text-positive' : 'text-destructive'}`}>
              {formatCurrency(transactionsReceived - transactionsSent)}
            </p>
          </div>
        </div>

        <Separator />

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-3 py-4">
            {allItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No activity yet
              </div>
            ) : (
              allItems.map((item, index) => (
                <div key={`${item.type}-${index}`} className="border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                  {item.type === 'expense' && (
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <Receipt weight="fill" className="text-primary mt-0.5 flex-shrink-0" size={18} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.data.description}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {format(new Date(item.timestamp), 'MMM d, yyyy • h:mm a')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant={item.data.type === 'shared' ? 'secondary' : 'outline'}>
                            {item.data.type === 'shared' ? 'Shared' : 'Individual'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onDeleteExpense(item.data.id)}
                          >
                            <Trash weight="bold" size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="ml-6 space-y-1">
                        {item.data.paidBy === person.id && (
                          <p className="text-sm text-positive">
                            ✓ Paid {formatCurrency(item.data.amount)}
                          </p>
                        )}
                        {item.data.type === 'individual' && item.data.owedBy === person.id && (
                          <p className="text-sm text-destructive">
                            • Owed {formatCurrency(item.data.amount)}
                          </p>
                        )}
                        {item.data.type === 'shared' && (
                          <p className="text-sm text-muted-foreground">
                            • Your share: {formatCurrency(item.data.amount / people.length)}
                          </p>
                        )}
                        {item.data.type === 'individual' && item.data.owedBy && item.data.owedBy !== person.id && (
                          <p className="text-sm text-muted-foreground">
                            • For: {getPersonName(item.data.owedBy)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {item.type === 'transaction' && (
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <CurrencyDollar weight="fill" className="text-accent mt-0.5 flex-shrink-0" size={18} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{getPersonName(item.data.from)}</span>
                              <ArrowRight size={16} className="text-muted-foreground flex-shrink-0" />
                              <span className="font-medium">{getPersonName(item.data.to)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {format(new Date(item.timestamp), 'MMM d, yyyy • h:mm a')}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onDeleteTransaction(item.data.id)}
                        >
                          <Trash weight="bold" size={16} />
                        </Button>
                      </div>
                      <div className="ml-6 space-y-1">
                        <p className={`text-sm font-medium ${item.data.from === person.id ? 'text-destructive' : 'text-positive'}`}>
                          {item.data.from === person.id ? '↓ Sent' : '↑ Received'} {formatCurrency(item.data.amount)}
                        </p>
                        {item.data.note && (
                          <p className="text-sm text-muted-foreground italic">
                            "{item.data.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
