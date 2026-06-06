import { Balance } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'
import { Card } from '@/components/ui/card'
import { CheckCircle, PencilSimple, Trash } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface BalanceCardProps {
  balance: Balance
  index: number
  onEdit: (personId: string, name: string) => void
  onDelete: (personId: string, name: string) => void
}

export function BalanceCard({ balance, index, onEdit, onDelete }: BalanceCardProps) {
  const getBalanceColor = (bal: number) => {
    if (Math.abs(bal) < 0.01) return 'text-muted-foreground'
    return bal > 0 ? 'text-positive' : 'text-destructive'
  }

  const getBalanceStatus = (bal: number) => {
    if (Math.abs(bal) < 0.01) return 'Settled'
    return bal > 0 ? 'Owed' : 'Owes'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-lg truncate font-[family-name:var(--font-space-grotesk)]">
                {balance.name}
              </h3>
              {Math.abs(balance.balance) < 0.01 && (
                <CheckCircle weight="fill" className="text-positive flex-shrink-0" size={18} />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {getBalanceStatus(balance.balance)}
            </p>
            <span className={`text-xl font-bold font-mono tabular-nums ${getBalanceColor(balance.balance)}`}>
              {formatCurrency(Math.abs(balance.balance))}
            </span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(balance.personId, balance.name)}
            >
              <PencilSimple className="text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(balance.personId, balance.name)}
            >
              <Trash className="text-destructive" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
