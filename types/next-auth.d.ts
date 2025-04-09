import { DefaultSession, DefaultUser } from "next-auth";

interface CustomUser extends DefaultUser {
  id: string;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  role?: string;
}


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName?: string | null | undefined;
      lastName?: string | null | undefined;
      role?: string;
      email?: string | null | undefined;
      name?: string | null | undefined;
      image?: string | null | undefined;
    };
  }

  interface User extends CustomUser {}
}


declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    role?: string;
    email?: string | null | undefined;
  }
}