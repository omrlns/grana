# CLAUDE.md

GRANA is a personal finance PWA (Brazil, BRL) replacing spreadsheets, with a shared "MÔNEY" module for couples.
**Read [PRD.md](PRD.md) before implementing any feature** — it is the source of truth for product behavior.

## Stack

- **Frontend:** Vite + React + TypeScript (strict), React Router, TanStack Query, React Hook Form + Zod, Tailwind CSS + shadcn/ui, date-fns, `vite-plugin-pwa`.
- **Backend:** Supabase only (Postgres, Auth, Row Level Security, `pg_cron` / Edge Functions when server-side jobs are needed). No custom server.
- **Tests:** Vitest for domain logic; pgTAP or SQL tests for RLS and database functions when relevant.
- **Hosting:** static deploy (Vercel / Cloudflare Pages). Must fit Supabase free tier.

## Conventions

- **Code in English** (tables, columns, variables, files). **UI text in pt-BR.**
- **Money is always integer cents** (`bigint` in Postgres, `number` in TS). Never use floats for money. Format only at the UI edge with `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- Dates for transactions are `date` (no time). Timezone: `America/Sao_Paulo`.
- Database changes only via migrations in `supabase/migrations/`. Regenerate TS types (`supabase gen types`) after each migration.
- Every user-owned table has `user_id` (or `space_id` for MÔNEY) and **RLS enabled with explicit policies**. Never ship a table without RLS.
- Used entities (accounts, categories, cards) are **archived** (`archived_at`), never hard-deleted.
- Keep domain rules (invoice cycle, financial month, installments, budget rollover, split) as **pure, unit-tested functions** in `src/domain/`, independent of React and Supabase.
- Mobile-first layouts; the quick-add ("+") flow must stay fast and short.

## Domain model (initial)

| Table | Purpose |
|---|---|
| `profiles` | User settings, incl. `financial_month_start_day` (default 1; owner uses 26). |
| `accounts` | `type`: `checking` \| `wallet` \| `credit_card`. Cards have `closing_day`, `due_day`, `default_payment_account_id`, optional `credit_limit`. `initial_balance`. |
| `categories` | `kind`: `income` \| `expense`. Name, color, icon. No subcategories. |
| `transactions` | `type`: `income` \| `expense` \| `transfer`. `amount` (cents, positive), `date`, `account_id`, `to_account_id` (transfers), `category_id`, `payment_method` (`cash` \| `debit` \| `credit` \| `pix`), `invoice_id`, `purchase_id` + `installment_number`/`installment_count`, `recurring_id`, `shared_expense_id`. |
| `purchases` | Groups installments of one credit purchase (total, count). |
| `invoices` | Per card: `closing_date`, `due_date`, status. |
| `recurring_expenses` | Fixed expenses: amount, day, category, account, payment method, active flag, optional `space_id`. |
| `budgets` | Monthly amount per expense category, versioned by `starts_at` month (a change creates a new row; past months keep their value). |
| `spaces`, `space_members`, `space_invites` | MÔNEY space and membership via email invite. |
| `shared_expenses` | MÔNEY entries: date, description, total, `paid_by`, per-member shares; `kind`: `expense` \| `settlement`. |

## Business rules (easy to get wrong — keep tests for each)

1. **No double counting on credit cards.** A card purchase is the expense. Paying the invoice is a `transfer` (checking → card) and is **never** counted as expense or in budgets. An invoice spanning two financial months has each purchase counted in its own month (see PRD §6.1 example).
2. **Financial month.** Starts on `financial_month_start_day` and is named after the month it ends in (26/11–25/12 = December). Budgets and spending reports use the **purchase date** for every payment method. Installment *k* counts in the financial month of `purchase_date + (k−1) months`. Cash-flow view lives on the invoices screen. Changing the start day applies from the next financial month; the transition month stretches/shrinks to connect the periods; past months are never recalculated.
3. **Invoice assignment.** `day(purchase) <= closing_day` → invoice closing that month; else next month. Due date is in the closing month if `due_day > closing_day`, else the following month. Clamp days to the month's last day. Users may manually move a purchase to another invoice. Changing `closing_day`/`due_day` applies only from a user-chosen future invoice onward (keep the history of card date settings); existing invoices keep their dates. Don't enforce bank-specific rules for date changes.
4. **Installments.** Split total cents by N; rounding remainder goes to the first installment. Editing/deleting the purchase affects all installments.
5. **Budget rollover.** `balance(month) = budget(month) + balance(previous month) − spent(month)`. Positive and negative balances both carry over. `budget(month)` is the latest version with `starts_at <= month`.
6. **Recurring expenses** are generated idempotently (unique on `recurring_id` + period) — safe to run the generator more than once.
7. **Transfers** never affect income/expense totals.
8. **MÔNEY.** Default split 50/50, editable per entry. Settlements count 100% to the paid/received side. Running balance from the viewer's perspective: positive (green) = the other owes me; negative (red) = I owe. When I pay a shared expense from my account, the account loses the full amount but **only my share** counts in my budget. When the other member pays, no account of mine moves, but my share still counts in my budget under the **same category the payer chose** (matched by name in my categories; created for me if missing).
9. **Credit limit.** `available = credit_limit − unpaid card purchases (incl. future installments)`. Invoice payments free up the limit.

## Working agreements

- Follow the roadmap phases in PRD.md §8; don't build later-phase features early.
- Open questions are listed in PRD.md §9 — ask instead of assuming when touching those areas, and record the decision there.
- When a product decision changes, update PRD.md (and this file, if it affects conventions or rules) in the same change.
