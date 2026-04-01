"use client"

import { useState } from "react"
import Link from "next/link"

const FAQ_ITEMS = [
  {
    id: "what-is-phoenix",
    question: "What is Phoenix Protocol?",
    answer: "Phoenix Protocol is a structured yield protocol offering perpetual autocallable vaults with two-sided deposits, coupon payoffs, and fully onchain settlement powered by Chainlink CRE.",
  },
  {
    id: "how-it-works",
    question: "How do perpetual vaults work on Phoenix?",
    answer: "Each vault has two sides: Side A deposits the underlying asset and earns USDC coupons, while Side B deposits USDC and profits from knock-in events. At each observation period, Chainlink CRE fetches the asset price and evaluates three barriers: cycle reset (above autocall), coupon payment, and knock-in (downside). The vault runs perpetual cycles — when a cycle ends, the strike resets and a new cycle begins automatically.",
  },
  {
    id: "two-sided",
    question: "What are Side A and Side B?",
    answer: "Side A (Earn) deposits the underlying asset (ETH, wstETH, xTSLA, etc.) and earns USDC coupons paid from Side B capital each period. Side B (Hedge) deposits USDC and profits when a knock-in triggers — Side A assets are liquidated via CowSwap and proceeds go to Side B. This creates a balanced risk-reward structure between yield seekers and downside hedgers.",
  },
  {
    id: "supported-assets",
    question: "What assets are supported on Phoenix?",
    answer: "Phoenix supports 19 vaults across 5 categories: Spot (ETH, BTC, SOL, stETH, wstETH via DeFi Llama), Perps (ETH, BTC, SOL via Hyperliquid), Yield tokens (uniETH YT, sUSDai YT, weETH YT, wstETH YT via Pendle), Rates (Aave WETH, USDC, USDT, sGHO via DeFi Llama), and Equities (TSLA, AAPL, NVDA via xStocks).",
  },
  {
    id: "getting-started",
    question: "How do I get started?",
    answer: "Connect your wallet on Ethereum Sepolia, choose the Earn or Hedge side, browse available vaults, review the parameters (strike price, barriers, coupon rate), approve your tokens, and deposit. The protocol handles everything else — observations, coupon payments, cycle resets, and liquidations are all automated.",
  },
  {
    id: "what-is-phoenix-memory",
    question: "What is Phoenix Memory?",
    answer: "Phoenix Memory remembers missed coupon payments when the price is between the knock-in and coupon barriers. These missed coupons accumulate (up to the memory depth cap) and are paid retroactively the next time the price recovers above the coupon barrier, at cycle reset, or at cycle end. If a knock-in occurs, all memory coupons are forfeited.",
  },
  {
    id: "what-are-barriers",
    question: "What are autocall, coupon, and knock-in barriers?",
    answer: "Barriers are price thresholds relative to the strike price. The autocall barrier (typically 105%) triggers a cycle reset with coupon payout. The coupon barrier (typically 95%) triggers periodic yield payments. The knock-in barrier (typically 75%) triggers immediate liquidation — Side A assets are sold via CowSwap and the cycle resets with a new strike.",
  },
  {
    id: "what-happens-knock-in",
    question: "What happens if a knock-in occurs?",
    answer: "When the price falls below the knock-in barrier, a proportional amount of Side A assets is liquidated via CowSwap. USDC proceeds go to Side B depositors. All accumulated Phoenix Memory coupons are forfeited. The cycle then resets with the current price as the new strike, and the vault continues running.",
  },
  {
    id: "how-settlement-works",
    question: "How do withdrawals work?",
    answer: "Withdrawals use a two-step process with a 1-hour cooldown: first request a withdrawal, then execute it after the cooldown period. Your share of the vault is proportional: assets and earned USDC for Side A, or USDC capital for Side B. Withdrawals are blocked during pending CowSwap liquidations.",
  },
  {
    id: "what-is-cre",
    question: "What is Chainlink CRE?",
    answer: "Chainlink CRE (Compute Runtime Environment) is the off-chain compute platform that powers Phoenix observations. A CRE workflow triggers on a cron schedule, fetches asset prices from 5 different data sources (DeFi Llama, Hyperliquid, Pendle, Aave, xStocks), evaluates barrier conditions, signs a report, and delivers it on-chain to the PerpetualSettlement contract.",
  },
  {
    id: "cowswap",
    question: "How does CowSwap liquidation work?",
    answer: "On knock-in, the vault initiates a two-phase CowSwap liquidation: (1) the vault creates an order and approves the GPv2 VaultRelayer, (2) a keeper pre-signs the order on GPv2Settlement, (3) CoW solvers find the best execution price, and (4) the keeper finalizes, crediting USDC proceeds to Side B. If no fill occurs within 1 hour, the liquidation can be cancelled.",
  },
  {
    id: "is-it-testnet",
    question: "Is Phoenix live on mainnet?",
    answer: "Phoenix is currently deployed on Ethereum Sepolia (testnet) with 19 perpetual vaults. You can try the full deposit, observation, and settlement flow using test tokens without real funds.",
  },
]

export default function FaqPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-4"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
          <p className="mt-2 text-sm text-gray-500">
            Everything you need to know about Phoenix Protocol
          </p>
        </div>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item) => {
            const isOpen = expandedId === item.id
            return (
              <div key={item.id} className="border-b border-white/5">
                <button
                  onClick={() => setExpandedId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between py-5 text-left group cursor-pointer"
                >
                  <span className="text-[15px] font-medium text-white group-hover:text-blue-400 transition-colors pr-4">
                    {item.question}
                  </span>
                  <svg
                    className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? "max-h-60 opacity-100 pb-5" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm text-gray-400 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
