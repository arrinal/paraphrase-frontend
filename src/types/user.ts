export interface User {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  refresh_token: string
  user: User
} 