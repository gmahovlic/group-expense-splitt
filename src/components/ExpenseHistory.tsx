import { Expense, Person } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash, CurrencyDollar, UsersThree } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface ExpenseHistoryProps {
  expenses: Expense[]
  people: Person[]
  onDeleteExpense: (expenseId: string) => void
}

export function ExpenseHistory({ expenses, people, onDeleteExpense }: ExpenseHistoryProps) {
  const getPersonName = (personId: string) => {
    return people.find(p => p.id === personId)?.name || 'Unknown'
  }

  const sortedExpenses = [...expenses].sort((a, b) => b.timestamp - a.timestamp)

  if (expenses.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No expenses recorded yet. Add your first expense to get started.
        </p>
      </Card>
    )
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <AnimatePresence mode="popLayout">
        <div className="space-y-2">
          {sortedExpenses.map((expense) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {expense.type === 'shared' ? (
                      <UsersThree weight="fill" size={20} className="text-primary" />
                    ) : (
                      <CurrencyDollar weight="fill" size={20} className="text-accent" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium truncate font-[family-name:var(--font-space-grotesk)]">
                        {expense.description}
                      </h4>
                      <span className="font-bold font-mono tabular-nums text-foreground flex-shrink-0">
                        {formatCurrency(expense.amount)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                      <Badge variant={expense.type === 'shared' ? 'default' : 'secondary'} className="text-xs">
                        {expense.type === 'shared' ? 'Shared' : 'Individual'}
                      </Badge>
                      <span>Paid by {getPersonName(expense.paidBy)}</span>
                      {expense.type === 'individual' && expense.owedBy && (
                        <span>• Owed by {getPersonName(expense.owedBy)}</span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDeleteExpense(expense.id)}
                  >
                    <Trash weight="bold" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </ScrollArea>
  )
}
