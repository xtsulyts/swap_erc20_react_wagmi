import Liquidity from "../componentes/Liquidez";
import { useAccount } from 'wagmi';

const LiquidesPages = () => {
    const { isConnected } = useAccount();
    
    // Define las mismas constantes que tienes en Home.tsx
    const SIMPLE_DEX_ADDRESS = '0x3D5B5a5328a0f29375b3cDcBE31B1aB5c2AB906A';
    const TOKEN_A_ADDRESS = '0x039EC09b85F1C317F0831B100eFd5c4e2463f372';
    const TOKEN_B_ADDRESS = '0xBeaC73A7755BeED1337Ca95137EB8b9247f88542';

    // Función formatBalance - cópiala de Home.tsx
    const formatBalance = (balance: unknown, decimals: number = 18) => {
        if (!balance || typeof balance !== 'bigint') return '0.0';
        
        const balanceStr = balance.toString().padStart(decimals + 1, '0');
        const wholePart = balanceStr.slice(0, -decimals) || '0';
        const fractionalPart = balanceStr.slice(-decimals).slice(0, 4);
        const cleanWhole = wholePart.replace(/^0+/, '') || '0';

        return `${cleanWhole}.${fractionalPart}`;
    };

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
            <div className="max-w-md mx-auto mt-20">
                <Liquidity
                    SIMPLE_DEX_ADDRESS={SIMPLE_DEX_ADDRESS}
                    TOKEN_A_ADDRESS={TOKEN_A_ADDRESS}
                    TOKEN_B_ADDRESS={TOKEN_B_ADDRESS}
                    isConnected={isConnected}
                    formatBalance={formatBalance}
                />
            </div>
        </div>
    )
}

export default LiquidesPages;