import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { claimUsername } from "./actions";

export default async function Home() {
  const user = await currentUser();

  // State 1: Logged out
  if (!user) {
    return (
      <main className="min-h-screen">
        <header className="flex justify-between items-center px-6 py-4 max-w-4xl mx-auto">
          <span className="text-xl font-bold">Nexus</span>
          <div className="flex items-center gap-3">
            <SignInButton>
              <button className="text-gray hover:text-black font-medium px-4 py-2">
                Entrar
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-yellow hover:bg-yellow/75 text-black rounded-full font-semibold px-4 py-2">
                Criar conta
              </button>
            </SignUpButton>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center px-6 pt-32 pb-32">
          <h1 className="text-5xl sm:text-6xl font-bold text-black text-center leading-tight max-w-2xl mb-6">
            Todos seus links,<br /> em um só lugar
          </h1>
          <p className="mt-6 mb-8 text-xl text-gray text-center max-w-wd">
            Crie sua página pessoal e compartilhe tudo que você quiser com apenas um link.
          </p>
          <SignUpButton>
            <button className="mt-10 bg-yellow text-black hover:bg-yellow/75 rounded-full font-semibold px-4 py-3">
              Criar minha página de graça
            </button>
          </SignUpButton>
          <p className="mt-4 text-sm text-gray">
            Demora menos de 1 minuto
          </p>
        </div>
      </main>
    );
  }

  // Check if user has a profile in database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { links: true }
  });

  // State 2: Logged in but no DB profile
  if (!dbUser) {
    return (
      <main className="min-h-screen">
        <header className="flex justify-end items-center px-6 py-4 max-w-4xl mx-auto">
          <UserButton />
        </header>

        <div className="flex flex-col items-center px-6 pt-16 pb-32">
          <div className="text-5xl mb-6">👋</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-black text-center">
            Bem-vindo à bordo!
          </h1>
          <p className="mt-4 text-lg text-gray text-center max-w-md">
            Vamos configurar sua página pessoal. Escolha seu nome de usuário para começar
          </p>

          <div className="mt-10 w-full max-w-md bg-white rounded-xl p-6 shadow-sm border border-border">
            <form action={claimUsername}>
              <label className="block text-sm font-medium text-gray mb-2">
                Sua URL personalizada
              </label>
              <div className="flex items-center bg-[#f7f7f7] rounded-xl border border-border overflow-hidden">
                <span className="text-gray pl-4 pr-1">nexus.bio/</span>
                <input 
                  type="text"
                  name="username"
                  placeholder="seunome"
                  required
                  minLength={3}
                  pattern="^[a-zA-Z0-9_]+$"
                  className="flex-1 bg-transparent text-black py-4 pr-4 outline-none placeholder:text-gray"
                />
              </div>
              <p className="mt-2 text-xs text-gray">
                Apenas letras, números e underlines
              </p>
              <button
                type="submit"
                className="mt-6 w-full bg-yellow hover:bg-yellow/75 text-black rounded-full font-semibold py-3"
              >
                Criar minha página
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // State 3: Has DB profile - Show dashboard
  return (
    <main className="min-h-screen">
      <header className="flex justify-between items-center px-6 py-4 max-w-4xl mx-auto">
        <span className="text-xl font-bold">Nexus</span>
        <UserButton />
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* profile card */}
        <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-sm border border-border text-center">
          <div className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center text-2xl font-bold">
            {(dbUser.name?.[0] || dbUser.username[0]).toUpperCase()}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-black">
            {dbUser.name || dbUser.username}
          </h1>
          <p className="mt-1 text-gray">
            nexus.bio/{dbUser.username}
          </p>
          <button className="mt-4 border border-border hover:border-yellow text-black rounded-full py-2 px-4">
            Copiar link
          </button>
        </div>

        {/* links card */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-black">Meus links</h2>
            <button className="bg-yellow hover:bg-yellow/75 text-black rounded-full font-semibold px-5 py-3">
              + Adicionar link
            </button>
          </div>

          {dbUser.links.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔗</div>
              <p className="text-gray">
                Sem links ainda. Adicione o seu primeiro link!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dbUser.links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 bg-[#f7f7f7] rounded-xl border border-border"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-black truncate">{link.title}</p>
                    <p className="text-sm text-gray truncate">{link.url}</p>
                  </div>
                  <button className="ml-4 text-gray hover:text-black">
                    ...
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}