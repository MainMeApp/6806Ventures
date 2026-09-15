"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setPreferredLocale(locale: "en" | "es") {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated.");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { preferredLocale: locale },
  });

  revalidatePath("/learn");
}
