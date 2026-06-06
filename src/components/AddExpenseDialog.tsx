import { useState } from 'react'
import { Plus } from '@phosphor-icons/react'
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
import { Person } from '@/lib/types'

interface AddExpenseDialogProps {
  people: Person[]
  onAddExpense: (
    description: string,
    amount: number,
    paidBy: string,
    type: 'shared' | 'individual',
    owedBy?: string
  ) => void
}

export function AddExpenseDialog({ people, onAddExpense }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [type, setType] = useState<'shared' | 'individual'>('shared')
  const [owedBy, setOwedBy] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = parseFloat(amount)
    
    if (description.trim() && amountNum > 0 && paidBy) {
      if (type === 'individual' && !owedBy) {
        return
      }
      
      onAddExpense(
        description.trim(),
        amountNum,
        paidBy,
        type,
        type === 'individual' ? owedBy : undefined
      )
      
      setDescription('')
      setAmount('')
      setPaidBy('')
      setType('shared')
      setOwedBy('')
      setOpen(false)
    }
  }

  const isValid = description.trim() && parseFloat(amount) > 0 && paidBy &&
    (type === 'shared' || (type === 'individual' && owedBy))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus weight="bold" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Record a new expense and who paid for it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Groceries, Taxi, Restaurant"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Expense Type</Label>
              <Select value={type} onValueChange={(value: 'shared' | 'individual') => {
                setType(value)
                if (value === 'shared') {
                  setOwedBy('')
                }
              }}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shared">Shared (split evenly)</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paid-by">Paid By</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger id="paid-by">
                  <SelectValue placeholder="Select person who paid" />
                </SelectTrigger>
                <SelectContent>
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {type === 'individual' && (
              <div className="grid gap-2">
                <Label htmlFor="owed-by">Owed By</Label>
                <Select value={owedBy} onValueChange={setOwedBy}>
                  <SelectTrigger id="owed-by">
                    <SelectValue placeholder="Select person who owes" />
                  </SelectTrigger>
                  <SelectContent>
                    {people.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
