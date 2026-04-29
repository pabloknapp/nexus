"use client"

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import LinkIcon from "@/public/link-icon.png"; 
import CheckIcon from "@/public/check-icon.png"; 

type CopyButtonProps = {
  url: string;
};

export default function CopyButton({ url }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Se clipboard falhar (permissão/HTTP), não muda o estado.
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="mt-2 border border-border hover:cursor-pointer rounded-full py-1 px-1.25 flex items-center justify-center"
    >
      {copied ? <Image src={CheckIcon} alt="Copiado" width={20} height={20} /> : <Image src={LinkIcon} alt="Copiar" width={20} height={20} /> } 
    </button>
  );
}