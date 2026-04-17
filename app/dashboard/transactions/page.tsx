"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Transfers } from "@/app/services/accountService"
import { useAuth } from "@/components/auth-provider"
import { getUserTransfers } from "@/app/services/accountService"

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transfers, setTransfers] = useState<Transfers[]>([])
  const [loading, setLoading] = useState(true)
  const currencySymbols: Record<string, string> = {
    RON: "RON",
    EUR: "€",
  }

  useEffect(() => {
    if (!user) return

    const loadTransfers = async () => {
      try {
        const data = await getUserTransfers(user.id)
        setTransfers(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadTransfers()
  }, [user])

  // @ts-ignore
  return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">View your transaction history</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History ({transfers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading transactions...</p>
            ) : transfers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No transactions found</p>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
  )
}