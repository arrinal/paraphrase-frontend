export function validateEmail(email: string): string[] {
    const errors: string[] = []
    
    if (!email) {
        errors.push("Email is required")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Please enter a valid email address")
    }

    return errors
}

export function validatePassword(password: string): string[] {
    const errors: string[] = []

    if (!password) {
        errors.push("Password is required")
    } else {
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long")
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter")
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter")
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least one number")
        }
    }

    return errors
}
