'use client';

import Image from "next/image";
import { useDynamicContext } from "@/lib/dynamic";
export default function Home() {
  const { setShowAuthFlow, primaryWallet } = useDynamicContext();

  const handleGenerateSupporterLink = async () => {
    if(!primaryWallet) return;
    setShowAuthFlow(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!primaryWallet && <div>
        <p>Generate your supporter link</p>
        <button onClick={() => handleGenerateSupporterLink()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Generate
        </button>
      </div>}
      {primaryWallet && <div>
        <p>Your supporter link</p>
        <p>https://support-a-creator.xyz/donate/{primaryWallet.address}</p>
        </div>}
    </main>
  );
}
