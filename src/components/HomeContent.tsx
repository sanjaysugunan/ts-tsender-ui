import AirdropForm from "./AirdropForm"
import { useAccount } from "wagmi"

export default function HomeContent() {
    const { isConnected } = useAccount()
    return (
        <div>
            {isConnected ? (
                <div>
                    <AirdropForm/>
                </div>
            ): (
            <div>Please connect a wallet...</div>
            )}
            
        </div> 
    );
         
}