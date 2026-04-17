"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockLoans, currencySymbols } from "@/lib/mock-data"
import { TrendingUp, Calendar, Percent, Banknote } from "lucide-react"
import { useState } from "react"

export default function LoansPage() {
  const [loanAmount, setLoanAmount] = useState("")
  const [loanTerm, setLoanTerm] = useState("12")
  const activeLoan = mockLoans[0]

  const calculateMonthly = () => {
    if (!loanAmount) return 0
    const principal = Number.parseFloat(loanAmount)
    const rate = 5.5 / 100 / 12
    const term = Number.parseInt(loanTerm)
    return (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">FlexiCredit Loans</h1>
        <p className="text-muted-foreground">Flexible loans tailored to your needs</p>
      </div>

      {activeLoan && (
        <Card className="bg-gradient-to-br from-chart-2/20 to-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Loan</CardTitle>
              <span className="px-3 py-1 bg-accent rounded-full text-sm font-semibold text-accent-foreground">
                Active
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Banknote className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="text-xl font-bold">
                    {currencySymbols[activeLoan.currency]}
                    {activeLoan.amount.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 rounded-lg p-2">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="text-xl font-bold">
                    {currencySymbols[activeLoan.currency]}
                    {activeLoan.monthlyPayment.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-chart-2/10 rounded-lg p-2">
                  <Percent className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="text-xl font-bold">{activeLoan.interestRate}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-xl font-bold">{activeLoan.term - 6} months</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Apply for FlexiCredit</CardTitle>
          <CardDescription>Get a flexible loan with competitive interest rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loan-amount">Loan Amount (€)</Label>
            <Input
              id="loan-amount"
              type="number"
              placeholder="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              min="1000"
              max="50000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loan-term">Loan Term</Label>
            <Select value={loanTerm} onValueChange={setLoanTerm}>
              <SelectTrigger id="loan-term">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 months</SelectItem>
                <SelectItem value="24">24 months</SelectItem>
                <SelectItem value="36">36 months</SelectItem>
                <SelectItem value="48">48 months</SelectItem>
                <SelectItem value="60">60 months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loanAmount && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Monthly Payment:</span>
                <span className="font-bold">€{calculateMonthly().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Interest Rate:</span>
                <span className="font-bold">5.5% APR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Repayment:</span>
                <span className="font-bold">€{(calculateMonthly() * Number.parseInt(loanTerm)).toFixed(2)}</span>
              </div>
            </div>
          )}

          <Button className="w-full" size="lg" disabled={!loanAmount}>
            Apply Now
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
