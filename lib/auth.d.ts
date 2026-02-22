import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      landlordId: string;
    };
  }

  interface User {
    landlordId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    landlordId?: string;
  }
}
