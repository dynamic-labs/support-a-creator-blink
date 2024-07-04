'use client';

import { useDynamicContext } from "@/lib/dynamic";
import useRootUrl from "@/app/hooks/useRootUrl";

export default function Home() {
  const rootUrl = useRootUrl();
  const { setShowAuthFlow, primaryWallet } = useDynamicContext();

  const handleGenerateSupporterLink = async () => {
    if (primaryWallet) return;
    setShowAuthFlow(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="w-full max-w-3xl text-center mb-12">
      </div>
      <div className="bg-gray-900 bg-opacity-90 p-10 rounded-lg shadow-lg text-center backdrop-blur-md border border-gray-800">
        {!primaryWallet && (
          <div>
            <p className="text-2xl mb-6 font-semibold">Generate your supporter link</p>
            <button 
              onClick={() => handleGenerateSupporterLink()} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
            >
              Generate
            </button>
          </div>
        )}
        {primaryWallet && (
          <div>
            <p className="text-2xl mb-6 font-semibold">Your supporter link</p>
            <p className="text-lg mb-4">
              <a
                href={`${rootUrl}/donate?address=${primaryWallet.address}`}
                className="text-blue-400 hover:text-blue-500 transition-colors duration-300"
              >
               {rootUrl}/donate?address={primaryWallet.address}
              </a>
            </p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
              onClick={() => navigator.clipboard.writeText(`${rootUrl}/donate?address=${primaryWallet.address}`)}
            >
              Copy Link
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

