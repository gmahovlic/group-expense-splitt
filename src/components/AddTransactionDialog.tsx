import { useState } from 'react'
import { Person } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowsLeftRight } from '@phosphor-icons/react'

interface AddTransactionDialogProps {
  people: Person[]
  onAddTransaction: (from: string, to: string, amount: number, note?: string) => void
}

export function AddTransactionDialog({ people, onAddTransaction }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!from || !to || !amount) {
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return
    }

    if (from === to) {
      return
    }

    onAddTransaction(from, to, amountNum, note || undefined)
    
    setFrom('')
    setTo('')
    setAmount('')
    setNote('')
    setOpen(false)
  }

  const availableToOptions = people.filter(p => p.id !== from)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={people.length < 2}>
          <ArrowsLeftRight weight="bold" />
          Add Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record a Payment</DialogTitle>
            <DialogDescription>
              Record a payment that was made between two people
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="from">From</Label>
              <Select value={from} onValueChange={setFrom} required>
                <SelectTrigger id="from">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {people.map(person => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="to">To</Label>
              <Select value={to} onValueChange={setTo} required disabled={!from}>
                <SelectTrigger id="to">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {availableToOptions.map(person => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="transaction-amount">Amount</Label>
              <Input
                id="transaction-amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="transaction-note">Note (optional)</Label>
              <Input
                id="transaction-note"
                type="text"
                placeholder="e.g. Settling up for dinner"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!from || !to || !amount}>
              Add Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
