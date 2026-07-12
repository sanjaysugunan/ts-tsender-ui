"use client";

import { useState, useMemo} from "react"
import { chainsToTSender, tsenderAbi, erc20Abi } from "../constants"
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi"
import { readContract, waitForTransactionReceipt } from "wagmi/actions"
import { calculateTotal } from "../utils";
 
export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()
    const total: number = useMemo(() => calculateTotal(amounts), [amounts])
    const {data: hash, isPending, writeContractAsync} = useWriteContract()

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number>  {
        if(!tSenderAddress){
            alert("No address found, please use a supported chain")
            return 0
        }
        // read from the chain to see if we have approved enough tokens
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`]
        })

        return response as number
    }

    async function handleSubmit() {
        // 1a. If already approved, move to step 2
        // 1b. Approve our tsender contract to send our tokens
        // 2. Call the airdrop function on the tsender contract
        // 3. Wait for the transaction to be mined
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        const approvedAmount = await getApprovedAmount(tSenderAddress)
        
        if (approvedAmount < total) {
            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress as `0x${string}`, BigInt(total)],
            })

            const approvalReceipt = await waitForTransactionReceipt(config, {
                hash: approvalHash
            })

            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            })
            
        } else {
            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            })
        }
    }


    return (
        <div className="mx-auto mt-12 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#111827]/80 p-8 shadow-2xl backdrop-blur">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">
                    ERC-20 Airdrop
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                    Send ERC-20 tokens to multiple recipients in a single
                    transaction.
                </p>
            </div>

            <form className="space-y-6">
                {/* Token Address */}
                <div>
                    <label
                        htmlFor="token"
                        className="mb-2 block text-sm font-medium text-gray-300"
                    >Token Address
                    </label>

                    <input
                        id="token"
                        type="text"
                        value={tokenAddress}
                        onChange={e => setTokenAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full rounded-xl border border-white/10 bg-[#1F2937] px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-500"
                    />
                </div>

                {/* Recipients */}
                <div>
                    <label
                        htmlFor="recipients"
                        className="mb-2 block text-sm font-medium text-gray-300"
                    >
                        Recipient Addresses
                    </label>

                    <textarea
                        id="recipients"
                        rows={6}
                        placeholder={`0x123...
0x456...
0x789...`}              
                        value={recipients}
                        onChange={e => setRecipients(e.target.value)}
                        className="w-full resize-none rounded-xl border border-white/10 bg-[#1F2937] px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-500"
                    />
                </div>

                {/* Amounts */}
                <div>
                    <label
                        htmlFor="amounts"
                        className="mb-2 block text-sm font-medium text-gray-300"
                    >
                        Amounts
                    </label>

                    <textarea
                        id="amounts"
                        rows={6}
                        value={amounts}
                        onChange={e => setAmounts(e.target.value)}
                        placeholder={`100
50
250`}
                        className="w-full resize-none rounded-xl border border-white/10 bg-[#1F2937] px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-500"
                    />
                </div>

                {/* Summary */}
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                            Total Recipients
                        </span>
                        <span className="font-semibold text-white">0</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-gray-400">Total Amount</span>
                        <span className="font-semibold text-cyan-400">
                            0 Tokens
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        className="flex-1 rounded-xl border border-white/10 bg-[#1F2937] px-5 py-3 font-medium text-white transition hover:bg-[#293548]"
                    >
                        Approve
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white transition hover:opacity-90"
                    >
                        Send Airdrop
                    </button>
                </div>
            </form>
        </div>
    );
}