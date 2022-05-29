export interface RegistrazioneUser {
  username: string,
  email: string,
  password: string,
  role: [
    {
      roleName: "user" | "admin"
    }
  ]
}
