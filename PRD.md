# Planning Guide

A collaborative expense splitting application that calculates the most efficient way to settle debts among any group of people, handling both shared and individual expenses with real-time balance updates.

**Experience Qualities**:
1. **Transparent** - Users can clearly see who owes what and why, with all calculations visible and understandable
2. **Effortless** - Adding expenses and people should be quick and intuitive, minimizing friction in tracking costs
3. **Fair** - The settlement algorithm ensures everyone pays exactly what they owe through the minimum number of transactions

**Complexity Level**: Light Application (multiple features with basic state)
- This is a feature-rich single-page application with multiple data entities (people, expenses, payments) and real-time calculations, but doesn't require multiple views or complex navigation patterns.

## Essential Features

**Add Group Members**
- Functionality: Create and manage a list of people in the expense group
- Purpose: Establish who is participating in shared expenses
- Trigger: User clicks "Add Person" button
- Progression: Click add person → Enter name → Save → Person appears in list with $0.00 balance
- Success criteria: Person is added to all expense dropdowns and balance calculations

**Record Individual Expenses**
- Functionality: Track personal costs that only one person should pay for
- Purpose: Account for non-shared items like individual meals or personal purchases
- Trigger: User clicks "Add Expense" and selects "Individual"
- Progression: Select expense type → Choose person who owes → Enter amount → Select who paid → Save → Balances update instantly
- Success criteria: Amount is attributed only to the specified person's debt

**Record Shared Expenses**
- Functionality: Track costs that should be split equally among all group members
- Purpose: Fairly distribute common expenses like groceries, accommodation, or group meals
- Trigger: User clicks "Add Expense" and selects "Shared"
- Progression: Select expense type → Enter total amount → Select who paid → Save → Amount splits evenly → Balances update instantly
- Success criteria: Cost is divided equally among all members and balances reflect the distribution

**Settlement Calculator**
- Functionality: Compute the minimum number of transactions needed to settle all debts
- Purpose: Simplify the payback process by showing who should pay whom and how much
- Trigger: Automatic calculation after any expense or payment is added
- Progression: Data changes → Algorithm calculates net balances → Determines optimal payment flow → Displays settlement instructions
- Success criteria: Shows clear "Person A pays Person B $X.XX" instructions that zero out all balances

**Expense History**
- Functionality: Display a chronological list of all recorded transactions
- Purpose: Provide transparency and allow users to review or delete past entries
- Trigger: Expenses automatically appear in the list as they're added
- Progression: View list → See description, amount, payer, and type → Click delete icon → Confirm → Expense removed → Balances recalculate
- Success criteria: All expenses are visible with complete details and can be removed

## Edge Case Handling

- **Empty Group**: Display helpful empty state encouraging users to add their first person
- **Single Person**: Show message that at least 2 people are needed to split expenses
- **Zero Balances**: Display "All settled up!" message when everyone is even
- **Deletion Confirmation**: Prevent accidental expense deletion with confirmation step
- **Decimal Precision**: Handle cent rounding in splits to ensure total always matches (assign remainder to first person)
- **Person with Expenses**: Warn when deleting a person who has associated expenses

## Design Direction

The design should evoke feelings of clarity, trust, and efficiency - like a well-organized spreadsheet that does the thinking for you. It should feel professional yet approachable, with a modern financial app aesthetic that conveys accuracy and reliability.

## Color Selection

A vibrant yet trustworthy palette inspired by modern fintech applications, using energetic teals and warm accents to make expense tracking feel less tedious.

- **Primary Color**: Rich Teal (oklch(0.55 0.12 195)) - Conveys trust, clarity, and financial stability while feeling more approachable than corporate blue
- **Secondary Colors**: 
  - Soft Slate background (oklch(0.98 0.005 220)) - Creates a calm, neutral canvas
  - Deep Charcoal (oklch(0.25 0.01 220)) - Professional and readable for text
- **Accent Color**: Vibrant Coral (oklch(0.68 0.18 25)) - Draws attention to CTAs and important actions, adds energy to balance displays
- **Foreground/Background Pairings**: 
  - Primary Teal (oklch(0.55 0.12 195)): White text (oklch(0.99 0 0)) - Ratio 5.8:1 ✓
  - Accent Coral (oklch(0.68 0.18 25)): White text (oklch(0.99 0 0)) - Ratio 5.2:1 ✓
  - Background Slate (oklch(0.98 0.005 220)): Deep Charcoal (oklch(0.25 0.01 220)) - Ratio 14.1:1 ✓
  - Positive Balance (oklch(0.62 0.17 150)): White text (oklch(0.99 0 0)) - Ratio 5.5:1 ✓
  - Negative Balance (oklch(0.58 0.20 15)): White text (oklch(0.99 0 0)) - Ratio 4.9:1 ✓

## Font Selection

Typography should feel modern, technical, and highly legible - conveying precision and mathematical accuracy while remaining friendly.

**Primary Font**: Space Grotesk (headers, person names, balances) - Geometric sans-serif with technical character that feels contemporary
**Secondary Font**: Inter (body text, expense details) - Clean, highly legible for UI text and numbers
**Monospace Font**: JetBrains Mono (currency amounts) - Tabular figures for perfect alignment of financial data

- **Typographic Hierarchy**:
  - H1 (App Title): Space Grotesk Bold / 32px / -0.02em tracking
  - H2 (Section Headers): Space Grotesk SemiBold / 24px / -0.01em tracking
  - Person Names: Space Grotesk Medium / 18px / normal tracking
  - Balance Amounts: JetBrains Mono Bold / 20px / tabular-nums
  - Body Text: Inter Regular / 15px / 0.4px tracking
  - Expense Details: Inter Medium / 14px / normal tracking
  - Small Labels: Inter Medium / 12px / 0.5px tracking / uppercase

## Animations

Animations should emphasize financial state changes and provide satisfying feedback for user actions, with subtle motion that reinforces the calculation-heavy nature of the app.

- **Balance Updates**: Smooth number counting animation when balances change (300ms ease-out)
- **Expense Addition**: Card slides in from bottom with slight bounce (400ms spring)
- **Settlement Cards**: Stagger appearance by 80ms each for sequential reveal
- **Delete Confirmation**: Scale and fade (200ms ease-in-out)
- **Button Press**: Subtle scale down to 0.97 on active state (100ms)
- **Success States**: Gentle pulse on settlement calculation complete (500ms ease-out)

## Component Selection

- **Components**:
  - **Dialog**: For adding people and expenses with form validation
  - **Card**: Primary container for people list, settlement instructions, and expense history
  - **Button**: Primary (Add Person/Expense), Secondary (Cancel), Destructive (Delete)
  - **Input**: Name and amount fields with proper number formatting
  - **Select**: Dropdown for choosing payer and expense type
  - **Badge**: Display expense types (Shared/Individual) with color coding
  - **Separator**: Divide sections within cards for visual hierarchy
  - **Alert Dialog**: Confirm deletion of people or expenses
  - **ScrollArea**: For expense history when list grows long

- **Customizations**:
  - **Balance Display Component**: Custom card showing person name, net balance with color-coding (green for owed, coral for owes, gray for settled)
  - **Settlement Arrow Component**: Custom visual showing payment flow with arrow icon between payers
  - **Expense Item Component**: Custom list item with icon, description, amount, and delete action

- **States**:
  - **Buttons**: Solid fill primary with hover brightness increase, active scale down, disabled opacity 50%
  - **Inputs**: Border focus with ring in primary color, error state in destructive red
  - **Cards**: Subtle shadow on hover for interactive cards, static shadow for display cards
  - **Badges**: Solid background with contrasting text, slightly rounded

- **Icon Selection**:
  - **Plus**: Add person/expense actions
  - **Trash**: Delete expenses or people
  - **Receipt**: Expense history section
  - **Users**: Group members section
  - **ArrowRight**: Settlement payment flow direction
  - **CircleDollarSign**: Individual expenses
  - **UsersThree**: Shared expenses
  - **CheckCircle**: Settled/zero balance state

- **Spacing**:
  - Section padding: p-6
  - Card gaps: gap-4
  - Button groups: gap-2
  - List items: py-3 px-4
  - Form fields: space-y-4
  - Grid columns: gap-6

- **Mobile**:
  - Single column layout for all sections
  - Full-width cards with reduced padding (p-4)
  - Stacked settlement instructions instead of inline arrows
  - Bottom-sheet dialogs for forms on mobile
  - Larger touch targets (min-h-12) for all interactive elements
  - Simplified expense list with wrapped text
