"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockTransactions, currencySymbols } from "@/lib/mock-data"
import { ArrowUpRight, ArrowDownRight, Send, PiggyBank, TrendingUp, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import {useEffect, useState} from "react"
import {
  getTotalBalance,
  type BankAccount,
  getUserAccounts,
  Transfers,
  getUserTransfers
} from "@/app/services/accountService"
import {useAuth} from "@/components/auth-provider";

export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true)
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const { user } = useAuth()
  const [transfers, setTransfers] = useState<Transfers[]>([])
  const currencySymbols: Record<string, string> = {
    RON: "RON",
    EUR: "€",
  }
  useEffect(() => {
    if (!user) return

    const loadTotalBalance = async () => {
      try {
        const data = await getTotalBalance(user.id)
        setTotalBalance(data.totalAmount)
      } catch (err) {
        console.error(err)
      }
    }

    const loadTransfers = async () => {
      try {
        const data = await getUserTransfers(user.id)
        setTransfers(data)
      } catch (err) {
        console.error(err)
      }
    }

    loadTransfers()

    loadTotalBalance()
  }, [user])

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Here&apos;s your financial overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2 bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Total Balance</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowBalance(!showBalance)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-1">
              {showBalance ? totalBalance.toFixed(2) : "••••••"}
              €
            </div>
            <p className="text-sm text-primary-foreground/80">Across accounts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/transfer" className="block">
          <Card className="hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-primary/10 rounded-xl p-3">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Send Money</h3>
                <p className="text-sm text-muted-foreground">Quick transfer</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Link href="/dashboard/transactions">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transfers.map((transaction) => (
                <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors border border-border"
                >
                  <div>
                    <p className="font-medium">{transaction.description?.trim() || "Transfer between accounts"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      From: {transaction.senderAccount.accountNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      To: {transaction.recipientAccountNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Date and time: {transaction.date}
                    </p>
                  </div>
                  <div className="text-right font-bold">
                    {transaction.amount.toFixed(2)}
                    {currencySymbols[transaction.senderAccount.currency]}
                  </div>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
