import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-[0_0_30px_rgba(59,130,246,0.45)]">
                        <span className="text-lg font-black text-white">
                            T
                        </span>
                    </div>

                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            TSender
                        </h1>

                        <p className="text-xs text-gray-400">
                            Fast ERC-20 Airdrops
                        </p>
                    </div>
                </div>

                {/* Wallet */}
                <ConnectButton />
            </div>
        </header>
    );
}