import { email, object, string } from "zod"
 
export const signInSchema = object({
  ldapUsername: email(),
  ldapPassword: string(),
})