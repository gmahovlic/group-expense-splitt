import { Expense, Person, Transaction } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash, CurrencyDollar, UsersThree, ArrowRight } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface ExpenseHistoryProps {
  expenses: Expense[]
  transactions: Transaction[]
  people: Person[]
  onDeleteExpense: (expenseId: string) => void
  onDeleteTransaction: (transactionId: string) => void
}

export function ExpenseHistory({ expenses, transactions, people, onDeleteExpense, onDeleteTransaction }: ExpenseHistoryProps) {
  const getPersonName = (personId: string) => {
    return people.find(p => p.id === personId)?.name || 'Unknown'
  }

  const allItems = [
    ...expenses.map(e => ({ type: 'expense' as const, data: e, timestamp: e.timestamp })),
    ...transactions.map(t => ({ type: 'transaction' as const, data: t, timestamp: t.timestamp }))
  ].sort((a, b) => b.timestamp - a.timestamp)

  if (allItems.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No expenses or transactions recorded yet.
        </p>
      </Card>
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <AnimatePresence mode="popLayout">
        <div className="space-y-2 pr-4">
          {allItems.map((item, index) => (
            <motion.div
              key={`${item.type}-${item.type === 'expense' ? item.data.id : item.data.id}-${index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                {item.type === 'expense' ? (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {item.data.type === 'shared' ? (
                        <UsersThree weight="fill" size={20} className="text-primary" />
                      ) : (
                        <CurrencyDollar weight="fill" size={20} className="text-accent" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium truncate font-[family-name:var(--font-space-grotesk)]">
                          {item.data.description}
                        </h4>
                        <span className="font-bold font-mono tabular-nums text-foreground flex-shrink-0">
                          {formatCurrency(item.data.amount)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                        <Badge variant={item.data.type === 'shared' ? 'default' : 'secondary'} className="text-xs">
                          {item.data.type === 'shared' ? 'Shared' : 'Individual'}
                        </Badge>
                        <span>Paid by {getPersonName(item.data.paidBy)}</span>
                        {item.data.type === 'individual' && item.data.owedBy && (
                          <span>• Owed by {getPersonName(item.data.owedBy)}</span>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteExpense(item.data.id)}
                    >
                      <Trash weight="bold" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <ArrowRight weight="bold" size={20} className="text-accent" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{getPersonName(item.data.from)}</span>
                          <ArrowRight size={16} className="text-muted-foreground flex-shrink-0" />
                          <span className="font-medium">{getPersonName(item.data.to)}</span>
                        </div>
                        <span className="font-bold font-mono tabular-nums text-positive flex-shrink-0">
                          {formatCurrency(item.data.amount)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          Payment
                        </Badge>
                        {item.data.note && (
                          <span className="italic">"{item.data.note}"</span>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteTransaction(item.data.id)}
                    >
                      <Trash weight="bold" />
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </ScrollArea>
  )
}
