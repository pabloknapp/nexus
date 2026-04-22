"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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
  } catch (error: unknown) {
    const err = error as { code?: unknown; meta?: { target?: unknown } };
    const target = err.meta?.target;
    const targetHasUsername =
      (typeof target === "string" && target.includes("username")) ||
      (Array.isArray(target) && target.some((t) => String(t).includes("username")));

    if (err.code === "P2002" && targetHasUsername) {
      throw new Error("Nome de usuário já existe");
    }
    throw error;
  }

  redirect("/");
}

export async function addLink(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  const title = (formData.get("title") as string | null)?.trim();
  const url = (formData.get("url") as string | null)?.trim();

  if (!title) {
    throw new Error("Título é obrigatório");
  }

  if (!url) {
    throw new Error("URL é obrigatória");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { id: true },
  });

  if (!dbUser) {
    throw new Error("Perfil não encontrado");
  }

  await prisma.link.create({
    data: {
      title,
      url,
      userId: dbUser.id,
    },
  });

  revalidatePath("/");
}

export async function deleteLink(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  const rawLinkId = formData.get("linkId") as string | null;
  const linkId = rawLinkId ? Number(rawLinkId) : NaN;

  if (!Number.isFinite(linkId)) {
    throw new Error("ID do link inválido");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { id: true },
  });

  if (!dbUser) {
    throw new Error("Perfil não encontrado");
  }

  await prisma.link.deleteMany({
    where: {
      id: linkId,
      userId: dbUser.id,
    },
  });

  revalidatePath("/");
}