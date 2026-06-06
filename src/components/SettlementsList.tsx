import { Settlement } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'
import { Card } from '@/components/ui/card'
import { ArrowRight, CheckCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface SettlementsListProps {
  settlements: Settlement[]
}

export function SettlementsList({ settlements }: SettlementsListProps) {
  if (settlements.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <CheckCircle weight="fill" size={48} className="text-positive" />
          <h3 className="text-xl font-semibold font-[family-name:var(--font-space-grotesk)]">
            All Settled Up!
          </h3>
          <p className="text-muted-foreground">
            Everyone's expenses are balanced.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {settlements.map((settlement, index) => (
        <motion.div
          key={`${settlement.from}-${settlement.to}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 }}
        >
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium font-[family-name:var(--font-space-grotesk)] truncate">
                    {settlement.fromName}
                  </span>
                  <ArrowRight weight="bold" className="text-primary flex-shrink-0" />
                  <span className="font-medium font-[family-name:var(--font-space-grotesk)] truncate">
                    {settlement.toName}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Payment to settle balance
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="text-xl font-bold font-mono tabular-nums text-accent">
                  {formatCurrency(settlement.amount)}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
