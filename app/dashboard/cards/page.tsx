"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Plus, Lock, Unlock } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { BankAccount, getUserAccounts } from "@/app/services/accountService"
import { createCreditCard, getUserCards } from "@/app/services/accountService"

export interface CardType {
  id: number
  cardNumber: string
  cvv: string
  expiryDate: string
  cardType: string
  accountId: number
  status: "active" | "blocked"
}

export default function CardsPage() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [cards, setCards] = useState<CardType[]>([])
  const [selectedAccount, setSelectedAccount] = useState<number | "">("")
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Load accounts and cards for the user
  // app/dashboard/cards/page.tsx
  useEffect(() => {
    if (!user?.id) return

    const loadData = async () => {
      try {
        const userId = Number(user.id)
        if (Number.isNaN(userId)) {
          console.error("Invalid user id:", user.id)
          return
        }

        const accountsData = await getUserAccounts(userId)
        setAccounts(accountsData ?? [])

        const cardsData = await getUserCards(userId)
        setCards(cardsData ?? [])
      } catch (err) {
        console.error("Failed to load accounts or cards", err)
      }
    }

    loadData()
  }, [user])

  const handleCreateCard = async () => {
    if (!selectedAccount || !user) return

    setLoading(true)
    try {
      // createCard may return partial data; capture response then refetch full list
      const created = await createCreditCard({
        accountId: selectedAccount,
        cardType: "DEBIT",
      })

      const userId = Number(user.id)
      if (!Number.isNaN(userId)) {
        const cardsData = await getUserCards(userId)
        setCards(cardsData ?? [{ ...created, status: "active" }])
      } else {
        // fallback: optimistic append if id conversion fails
        setCards((prev) => [...prev, { ...created, status: "active" }])
      }

      setSelectedAccount("")
      setIsOpen(false)
    } catch (err) {
      console.error("Failed to create card", err)
      alert("Failed to create card")
    } finally {
      setLoading(false)
    }
  }


  const toggleCardStatus = (cardId: number) => {
    setCards(
        cards.map((card) =>
            card.id === cardId
                ? { ...card, status: card.status === "active" ? "blocked" : "active" }
                : card
        )
    )
  }

  return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Cards</h1>
            <p className="text-muted-foreground">Manage your debit cards</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New Card
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Debit Card</DialogTitle>
                <DialogDescription>Select an account to attach your new card to</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-account">Attach to Account</Label>
                  <Select
                      value={selectedAccount === "" ? "" : selectedAccount.toString()}
                      onValueChange={(val) => setSelectedAccount(Number(val))}
                  >
                    <SelectTrigger id="card-account">
                      <SelectValue placeholder="Select account" />
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

                <Button
                    onClick={handleCreateCard}
                    disabled={!selectedAccount || loading}
                    className="w-full"
                >
                  {loading ? "Creating..." : "Create Card"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
              <Card
                  key={`${card.id}-${index}`}
                  className={`relative overflow-hidden ${card.status === "blocked" ? "opacity-60" : ""}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-90" />
                <CardContent className="relative p-6 text-primary-foreground">
                  <div className="flex justify-between items-start mb-8">
                    <CreditCard className="h-8 w-8" />
                    <div className="text-right">
                      <p className="text-xs opacity-80">Card Type</p>
                      <p className="font-semibold capitalize">{card.cardType}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs opacity-80 mb-1">Card Number</p>
                    <p className="text-2xl">{card.cardNumber}</p>
                    <p className="text-xs opacity-80 mb-1">CVV</p>
                    <p className="text-2xl">{card.cvv}</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-80 mb-1">Card Holder</p>
                        <p className="font-semibold">{user?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-80 mb-1">Expires</p>
                        <p className="font-semibold">{card.expiryDate}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>
      </div>
  )
}
