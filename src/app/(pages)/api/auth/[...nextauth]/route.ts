import { authOPtions } from "@/auth"
import NextAuth from "next-auth"


const handler = NextAuth(authOPtions)

export { handler as GET, handler as POST }