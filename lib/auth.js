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
          const response = await axios.post("https://final-backend-cssvdq88a-alcarzs-projects.vercel.app/api/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const user = response.data.user;
          user.token =response.data.token;

          if(!user.token){
            throw new Error("No Token Fetch");
          }

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
      // Add accessToken to the token if available
      if (user) {
        token.accessToken = user.token 
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the token's accessToken to the session
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken; // Add accessToken here
      return session;
    },
  },
};