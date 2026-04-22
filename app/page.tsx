import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { claimUsername } from "./actions";

export default async function Home() {
  const user = await currentUser();

  // State 1: Logged out
  if (!user) {
    return (
      <main className="flex-1 flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Bem-vindo</h1>
          <p className="text-lg text-slate-600 mb-8">
            Cadastre-se para criar seu perfil e compartilhar seus links
          </p>
          <div className="flex gap-4 justify-center">
            <SignInButton>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Entrar
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition">
                Criar conta
              </button>
            </SignUpButton>
          </div>
        </div>
      </main>
    );
  }

  // Check if user has a profile in database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  // State 2: Logged in but no DB profile
  if (!dbUser) {
    return (
      <main className="flex-1 flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-md w-full">
          <div className="flex justify-end mb-6">
            <UserButton />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Escolha seu nome de usuário</h1>
          <p className="text-slate-600 mb-6">
            Crie seu perfil para começar. Escolha um nome de usuário com 3+ caracteres
            (apenas letras, números e underlines).
          </p>
          <form action={claimUsername} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="your_username"
                required
                minLength={3}
                pattern="[a-zA-Z0-9_]+"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Criar perfil
            </button>
          </form>
        </div>
      </main>
    );
  }

  // State 3: Has DB profile - Show dashboard
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome, {dbUser.name || dbUser.username}
            </h1>
            <p className="text-slate-600 mt-1">@{dbUser.username}</p>
          </div>
          <UserButton />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Profile</h2>
          <div className="space-y-3 text-slate-700">
            <p>
              <span className="font-medium">Email:</span> {dbUser.email}
            </p>
            <p>
              <span className="font-medium">Username:</span> @{dbUser.username}
            </p>
            {dbUser.name && (
              <p>
                <span className="font-medium">Name:</span> {dbUser.name}
              </p>
            )}
            <p>
              <span className="font-medium">Joined:</span>{" "}
              {new Date(dbUser.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Links</h2>
          <p className="text-slate-600">
            Sem links ainda. Adicionar links ao perfil em breve!
          </p>
        </div>
      </div>
    </main>
  );
}