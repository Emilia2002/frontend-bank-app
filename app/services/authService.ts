export async function registerUser(
    fullName: string,
    email: string,
    password: string
) {
    const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fullName,
            email,
            password,
        }),
    })

    if (!response.ok) {
        throw new Error("Registration failed")
    }
}

export async function loginUser(email: string, password: string) {
    const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
        throw new Error("Invalid email or password")
    }

    return response.json()
}


