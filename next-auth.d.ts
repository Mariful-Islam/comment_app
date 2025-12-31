import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: any;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      // add more custom fields if you want
    };
  }
}
