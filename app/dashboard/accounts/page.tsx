"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { getUserAccounts, type BankAccount } from "@/app/services/accountService"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Copy, Check, Trash } from "lucide-react"
import {createBankAccount} from "@/app/services/accountService";
import {deleteBankAccount} from "@/app/services/accountService";
import { useAuth } from "@/components/auth-provider"

export default function AccountsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const [newAccount, setNewAccount] = useState({
    name: "",
    currency: "EUR" as "EUR" | "RON",
    amount: ""
  })
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreateAccount = async () => {
    if (!user) {
      alert("You must be logged in")
      return
    }

    await createBankAccount({
      accountName: newAccount.name,
      currency: newAccount.currency,
      balance: Number(newAccount.amount) || 0,
      userId: user?.id
    })

    const updatedAccounts = await getUserAccounts(user.id)
    setAccounts(updatedAccounts)
    setNewAccount({ name: "", currency: "EUR", amount: "" })
    setIsOpen(false)
  }

  const handleDeleteAccount = async (accountId: number) => {
    if (!user) return

    const confirmed = confirm("Delete this account?")
    if (!confirmed) return

    try {
      await deleteBankAccount(accountId, user.id)
      const updated = await getUserAccounts(user.id)
      setAccounts(updated)
    } catch (err) {
      console.error(err)
      alert("Failed to delete account")
    }
  }

  useEffect(() => {
    if (!user) return

    const loadAccounts = async () => {
      try {
        const data = await getUserAccounts(user.id)
        setAccounts(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadAccounts()
  }, [user])

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Accounts</h1>
          <p className="text-muted-foreground">Manage your bank accounts</p>
          {loading ? (
              <p>Loading accounts...</p>
          ) : accounts.length === 0 ? (
              <p className="text-muted-foreground">No accounts yet</p>
          ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {accounts.map((account) => (
                    <div key={account.id} className="rounded-xl border p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{account.accountName}</h3>
                        <span className="text-sm text-muted-foreground">{account.currency}</span>
                      </div>
                      <p className="text-xl font-bold">
                        {account.balance.toFixed(2)} {account.currency}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{account.accountNumber}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAccount(account.id)}
                            aria-label="Delete account"
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
              <DialogDescription>Choose a currency and name for your new account</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-name">Account Name</Label>
                <Input
                    id="account-name"
                    placeholder="e.g., Travel Fund"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-amount">Amount</Label>
                <Input
                    id="account-amount"
                    placeholder="e.g., 1000"
                    value={newAccount.amount}
                    onChange={(e) => setNewAccount({...newAccount, amount: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                    value={newAccount.currency}
                    onValueChange={(value: "EUR" | "RON") => setNewAccount({...newAccount, currency: value})}
                >
                  <SelectTrigger id="currency">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="RON">RON (lei)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateAccount} disabled={!newAccount.name} className="w-full">
                Create Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
