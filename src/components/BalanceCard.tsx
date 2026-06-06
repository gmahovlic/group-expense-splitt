import { Balance } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'
import { Card } from '@/components/ui/card'
import { CheckCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface BalanceCardProps {
  balance: Balance
  index: number
}

export function BalanceCard({ balance, index }: BalanceCardProps) {
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
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg truncate font-[family-name:var(--font-space-grotesk)]">
              {balance.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {getBalanceStatus(balance.balance)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {Math.abs(balance.balance) < 0.01 ? (
              <CheckCircle weight="fill" className="text-positive" size={20} />
            ) : null}
            <span className={`text-xl font-bold font-mono tabular-nums ${getBalanceColor(balance.balance)}`}>
              {formatCurrency(Math.abs(balance.balance))}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
