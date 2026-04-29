import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      links: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const avatarLetter = (user.name?.[0] || user.username[0] || "?").toUpperCase();

  return (
    <main className="min-h-screen px-6 py-12 bg-gray/10">
      <div className="mx-auto w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-yellow rounded-full flex items-center justify-center text-3xl font-bold text-black">
            {avatarLetter}
          </div>

          <h1 className="mt-5 text-2xl font-bold text-black">
            {user.name || user.username}
          </h1>
          <p className="mt-1 text-gray">@{user.username}</p>
        </div>

        <div className="mt-8 w-full max-w-md space-y-3">
          {user.links.length === 0 ? (
            <div className="text-center py-10 text-gray">
              Nenhum link publicado ainda.
            </div>
          ) : (
            user.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-full border bg-white border-gray/30 px-6 py-4 font-semibold text-center text-black hover:border-yellow"
              >
                <span className="truncate">{link.title}</span>
              </a>
            ))
          )}
        </div>

        <div className="text-center pb-8 mt-12">
          <Link
            href="/"
            className="text-sm text-gray hover:text-black underline underline-offset-4 transition-colors"
          >
            Crie o seu – <span className="font-semibold">Nexus</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
