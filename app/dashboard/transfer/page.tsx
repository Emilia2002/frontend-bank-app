"use client"

import {useEffect, useState} from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { currencySymbols } from "@/lib/mock-data"
import { Send, CheckCircle } from "lucide-react"
import {BankAccount, createTransfer, getUserAccounts} from "@/app/services/accountService";
import {useAuth} from "@/components/auth-provider";

export default function TransferPage() {
  const [fromAccount, setFromAccount] = useState("")
  const [toAccount, setToAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("")
  const [description, setDescription] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<BankAccount[]>([])

  useEffect(() => {
    if (!user) return

    const loadAccounts = async () => {
      try {
        const data = await getUserAccounts(user.id)
        setAccounts(data)
      } catch (err) {
        console.error(err)
      }
    }

    loadAccounts()
  }, [user])

  const handleTransfer = async () => {
    if (!user) return

    try {
      await createTransfer(
          {
            senderAccountId: Number(fromAccount),
            recipientAccountNumber: toAccount,
            amount: Number(amount),
            description,
          },
          user.id
      )
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        setFromAccount("")
        setToAccount("")
        setAmount("")
        setDescription("")
      }, 3000)
    } catch (err) {
      console.error(err)
      alert("Transfer failed: " + (err as Error).message)
    }
  }


  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transfer Money</h1>
        <p className="text-muted-foreground">Send money between your accounts or to others</p>
      </div>

      {isSuccess ? (
        <Card className="border-accent">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-accent/10 rounded-full p-4 mb-4">
              <CheckCircle className="h-12 w-12 text-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Transfer Successful!</h2>
            <p className="text-muted-foreground">Your money has been sent successfully</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
            <CardDescription>Fill in the transfer information below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from-account">From Account</Label>
              <Select value={fromAccount} onValueChange={setFromAccount}>
                <SelectTrigger id="from-account">
                  <SelectValue placeholder="Select account"/>
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                        <div className="flex justify-between">
                          <span>{account.accountNumber}</span>
                        </div>
                  </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-account">To Account</Label>
              <Select value={toAccount} onValueChange={setToAccount}>
                <SelectTrigger id="to-account">
                  <SelectValue placeholder="Select account"/>
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.accountNumber}>
                        <div className="flex justify-between">
                          <span>{account.accountNumber}</span>
                        </div>
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                  id="description"
                  placeholder="What is this transfer for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button
                onClick={handleTransfer}
                disabled={!fromAccount || !toAccount || !amount || Number.parseFloat(amount) <= 0}
                className="w-full"
                size="lg"
            >
              <Send className="h-4 w-4 mr-2"/>
              Send Money
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
