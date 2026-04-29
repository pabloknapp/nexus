import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { addLink, claimUsername, deleteLink } from "./actions";
import CopyButton from "./components/copy-button";
import Image from "next/image";
import Logo from "@/public/nexus-logo.png"
import ViewLink from "@/public/view-link-icon.png"

export default async function Home() {
  const user = await currentUser();

  // State 1: Logged out
  if (!user) {
    return (
      <main className="min-h-screen">
        <header className="flex justify-between items-center border border-b-gray/20 px-[30vw] py-4 max-w-full mx-auto">
          <div className="flex items-center gap-1.25 select-none">
            <Image src={Logo} alt="Copiado" width={20} height={20} />
            <span className="text-md font-semibold">Nexus</span>
          </div>
          <div className="flex items-center gap-3">
            <SignInButton>
              <button className="text-gray hover:text-black hover:cursor-pointer font-medium px-4 py-2">
                Entrar
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-yellow hover:bg-yellow/75 hover:cursor-pointer text-black rounded-full font-semibold px-4 py-2">
                Criar conta
              </button>
            </SignUpButton>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center px-6 pt-32 pb-32 glow-container">
          <h1 className="text-5xl sm:text-6xl font-bold text-black text-center leading-tight max-w-2xl mb-6">
            Todos seus links,<br /> em um só lugar
          </h1>
          <p className="mt-6 mb-8 text-xl text-gray text-center max-w-wd">
            Crie sua página pessoal e compartilhe tudo que você quiser com apenas um link.
          </p>
          <SignUpButton>
            <button className="mt-6 bg-yellow text-black hover:bg-yellow/75 hover:cursor-pointer rounded-full font-semibold px-4 py-3">
              Criar minha página
            </button>
          </SignUpButton>
          <p className="mt-4 text-sm text-gray">
            Leva menos de 1 minuto
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

          <div className="mt-10 w-full max-w-md card">
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
        <div className="flex items-center gap-1.25 select-none">
          <Image src={Logo} alt="Copiado" width={20} height={20} />
          <span className="text-md font-semibold">Nexus</span>
        </div>
        <UserButton />
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* profile card */}
        <div className="flex flex-col items-center card text-center">
          <div className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center text-2xl font-bold">
            {(dbUser.name?.[0] || dbUser.username[0]).toUpperCase()}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-black">
            {dbUser.name || dbUser.username}
          </h1>
          <div className="flex items-center gap-2">
            <p className="mt-1 text-gray">
              nexus.bio/{dbUser.username}
            </p>
            <CopyButton url={`https://nexus.bio/${dbUser.username}`} />
          </div>
          <div className="mt-6 flex justify-center gap-2">
            <a 
              href={`/${dbUser.username}`}
              target="_blank"
              className="border border-gray/50 hover:bg-yellow/75 text-black rounded-full font-md px-4 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span>Ver minha página</span>
                <Image src={ViewLink} alt="Ver minha página" width={12} height={12} />
              </div>
            </a>
          </div>
        </div>
        
        <div className="mt-6 card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-black">Adicionar um novo link</h2>
          </div>
          <form action={addLink} className="flex flex-col gap-2">
              <input
                type="text"
                name="title"
                placeholder="Título"
                required
                className="w-full bg-[#f7f7f7] rounded-xl border border-border px-4 py-2 outline-none placeholder:text-gray"
              />
              <input
                type="url"
                name="url"
                placeholder="https://exemplo.com"
                required
                className="w-full bg-[#f7f7f7] rounded-xl border border-border px-4 py-2 outline-none placeholder:text-gray"
              />
              <button
                type="submit"
                className="w-[50%] mx-auto mt-4 bg-yellow hover:cursor-pointer hover:bg-yellow/75 text-black rounded-full font-semibold py-2"
              >
                Adicionar link
              </button>
            </form>
          </div>

        {/* links card */}
        <div className="mt-6 card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-black">Meus links ({dbUser.links.length})</h2>
          </div>

          {dbUser.links.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-6 select-none">🔗</div>
              <p className="text-gray">
                Sem links ainda. Adicione o seu primeiro link
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
                  <form action={deleteLink} className="ml-4">
                    <input type="hidden" name="linkId" value={link.id} />
                    <button type="submit" className="text-black hover:text-red-600 hover:cursor-pointer transition-colors">
                      Deletar
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}