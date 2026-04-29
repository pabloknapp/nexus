import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex flex-col items-center justify-center my-auto">
        <h1 className="text-7xl sm:text-8xl font-bold text-black mb-8">404</h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-black text-center mb-4">
          Página não encontrada
        </h2>
        <p className="text-lg text-gray text-center max-w-md mb-8">
          Desculpe, a página que você está procurando não existe ou foi removida.
        </p>
        <Link href="/">
          <button className="bg-yellow hover:bg-yellow/75 transition-colors hover:cursor-pointer text-black rounded-full font-semibold px-6 py-3">
            Voltar para o início
          </button>
        </Link>
      </div>
    </main>
  );
}
