import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      platformRole: string;
      organizationId: string | null;
      preferredLocale: string;
    } & DefaultSession["user"];
  }

  interface User {
    platformRole: string;
    organizationId: string | null;
    preferredLocale: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    platformRole: string;
    organizationId: string | null;
    preferredLocale: string;
  }
}
