import NextAuth, { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";


const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV !== 'production',
  pages: {
    signIn: "/login",
  },
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      
    }),
    
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }:any) {
      session.accessToken = token.accessToken;
      return session;
    },
  
  },

  secret: process.env.NEXTAUTH_SECRET,
  

};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
