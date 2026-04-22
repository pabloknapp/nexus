"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function claimUsername(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  const username = formData.get("username") as string;

  if (!username || username.length < 3) {
    throw new Error("Usuário deve ter pelo menos 3 caracteres");
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error("Nome de usuário só pode conter letras, números e underline");
  }

  try {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        username,
        name: user.fullName || undefined,
      },
    });
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("username")) {
      throw new Error("Nome de usuário já existe");
    }
    throw error;
  }

  redirect("/");
}