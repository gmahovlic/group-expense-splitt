import { Person, Expense, Transaction } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'
  Dialog
  DialogH
} from '@/compon
import { Separa
import { Butto
import { format } from 'date-fn
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Receipt, CurrencyDollar } from '@phosphor-icons/react'
import { format } from 'date-fns'

interface PersonHistoryDialogProps {
  open: boolean
  onDeleteTransaction: (transactionId: 

  open,
  person,
  transactions,
 


    ret

    e => 

    t => t.from

    ...personExpenses.map(e =>
  ].sort((a, b) => b.times

    .reduce((sum, e) => sum + e.amount, 0
  const totalOwed = expenses
   

    .reduce((sum, e) => sum + e.amount / 
  const transactionsSent = transactions
   

    .reduce((sum, t) => sum + t.amount, 0)
  return (
   

          </DialogTi

          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-lg font-bold f

            <p className="te
          <div className="bg-muted/50 ro
            <p className="text-lg font-bol

            <p className={`t
            </p>
        </div>

        <ScrollArea className="flex-1 
            {allItems.length === 0 ? 
                No activity yet

                <div key={`${item.type}
                    <div>
                        <div className="fl

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
                        <Badge variant={item.data.type === 'shared' ? 'secondary' : 'outline'} className="flex-shrink-0">
                          {item.data.type === 'shared' ? 'Shared' : 'Individual'}
                        </Badge>
                      </div>
                      <div className="ml-6 space-y-1">
                        {item.data.paidBy === person.id && (
                          <p className="text-sm text-positive">
                            ✓ Paid {formatCurrency(item.data.amount)}
                          </p>
                          
                      </div>
                        <p className={`text-sm font-medium ${item.
                        </p>
                          <p c
                          
                      </div>
                  )}
              ))
          </div>
      </DialogContent>
  )












































