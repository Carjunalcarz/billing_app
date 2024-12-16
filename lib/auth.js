import Credentials from "next-auth/providers/credentials";

import axios from "axios"; // Use Axios for API requests
import defaultAvatar  from "@/public/images/avatar/avatar-12.jpg";

export const authOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const response = await axios.post("http://localhost:3002/api/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const user = response.data.user;

          if (!user || !user.id || !user.email) {
            throw new Error("Invalid user data from API");
          }

          // Add default image if none is provided
          if (!user.image) {
            user.image = defaultAvatar; // Ensure the path is correct
          }

          return user;
        } catch (error) {
          console.error("API Login Error:", error.response?.data || error.message);
          throw new Error(error.response?.data?.message || "Login failed");
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV !== "production",

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.image;
      }
      return session;
    },
  },
};