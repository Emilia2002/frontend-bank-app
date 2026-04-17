
export interface BankAccount {
    id: number
    accountName: string
    accountNumber: string
    currency: string
    balance: number
}

export interface Transfers {
    id: number;
    senderAccount: {
        accountNumber: string;
        accountName: string;
        currency: string;
    };
    recipientAccountNumber: string;
    amount: number;
    description: string;
    date: string;
}

interface CreateCardData {
    accountId: number;
    cardType: string;
}

interface CardResponse {
    id: number;
    cardNumber: string;
    cvv: string;
    expiryDate: string;
    cardType: string;
    accountId: number;
}

export async function createCreditCard(data: CreateCardData): Promise<CardResponse> {
    const response = await fetch("http://localhost:8080/card/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create credit card: ${errorText}`);
    }

    return response.json();
}

export async function getUserCards(userId: number) {
    const response = await fetch(
        `http://localhost:8080/card/total-cards/${userId}`
    )

    if (!response.ok) {
        throw new Error("Failed to fetch total cards")
    }

    return response.json()
}

export async function createBankAccount(data: {
    accountName: string
    currency: string
    balance: number,
    userId: number
}) {
    const response = await fetch("http://localhost:8080/bank/create-account", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error("Failed to create bank account")
    }

    return response.json()
}

const API_URL = "http://localhost:8080"

export async function getUserAccounts(userId: number): Promise<BankAccount[]> {
    const res = await fetch(`${API_URL}/bank/accounts/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        throw new Error("Failed to fetch accounts")
    }

    return res.json()
}

export async function getTotalBalance(userId: number) {
    const response = await fetch(
        `http://localhost:8080/bank/total-amount/${userId}`
    )

    if (!response.ok) {
        throw new Error("Failed to fetch total balance")
    }

    return response.json()
}

export async function createTransfer(data: {
    senderAccountId: number,
    recipientAccountNumber: string,
    amount: number,
    description: string
}, userId: number) {
    const response = await fetch(`http://localhost:8080/bank/transfer/${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const errorBody = await response.json()
        throw new Error(errorBody.error || "Transfer failed")
    }
    return response.json()
}

export async function deleteBankAccount(accountId: number, userId: number): Promise<void> {
    const res = await fetch(`${API_URL}/bank/${accountId}/${userId}`, {
        method: "DELETE",
    })

    if (!res.ok) {
        throw new Error("Failed to delete bank account")
    }
}

export async function getUserTransfers(userId: number): Promise<Transfers[]> {
    const res = await fetch(`${API_URL}/bank/transfers/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        throw new Error("Failed to fetch transfers")
    }
    return res.json()
}

