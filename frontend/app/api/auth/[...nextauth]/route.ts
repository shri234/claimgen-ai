import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Clinic Account",
      credentials: {
        email: { label: "Work Email", type: "email", placeholder: "biller@clinic.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.email) {
          return {
            id: "user_clinic_01",
            name: "Dr. Sarah Adams",
            email: credentials.email,
            role: "Billing Specialist",
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "claimgen_secret_jwt_key_9941829",
});

export { handler as GET, handler as POST };
