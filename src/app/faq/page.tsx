"use client"

import { useState } from "react"
import Link from "next/link"

const FAQ_ITEMS = [
  {
    id: "what-is-phoenix",
    question: "What is Phoenix Protocol?",
    answer: "Phoenix brings institutional autocallable structured products onchain. Deposit USDC into a worst-of vault on tokenized indices (SPY/QQQ), earn periodic coupons with built-in downside protection, fully settled on Ink.",
  },
  {
    id: "how-it-works",
    question: "How does the vault work?",
    answer: "You deposit USDC. Every month, the protocol checks if SPY and QQQ are above 70% of their starting price. If yes, you earn a coupon (~0.75%). If both are above 100%, you get your capital back early (autocall). At maturity (6 months), if neither dropped below 70%, you get everything back.",
  },
  {
    id: "supported-assets",
    question: "What assets are supported?",
    answer: "Currently one vault: worst-of basket on the S&P 500 (wSPYx) and Nasdaq 100 (wQQQx), powered by xStocks tokenized indices on Ink.",
  },
  {
    id: "getting-started",
    question: "How do I get started?",
    answer: "Connect your wallet on Ink, deposit USDC (minimum $100), and the protocol handles observations, coupons, and settlement automatically.",
  },
  {
    id: "what-is-phoenix-memory",
    question: "What is Phoenix Memory?",
    answer: "Phoenix Memory remembers missed coupon payments when the price is between the knock-in and coupon barriers. These missed coupons accumulate and are paid retroactively the next time the price recovers above the coupon barrier or at maturity. If a knock-in occurs, all memory coupons are forfeited.",
  },
  {
    id: "what-are-barriers",
    question: "What are autocall, coupon, and knock-in barriers?",
    answer: "Barriers are price thresholds relative to the strike price. The autocall barrier (100%, stepping down 2% per observation) triggers early redemption with coupon payout. The knock-in barrier (70%) is checked at maturity. If the worst-performing index is below 70% at maturity, you absorb losses proportional to the drop.",
  },
  {
    id: "what-happens-knock-in",
    question: "What happens if a knock-in occurs?",
    answer: "If the worst-performing index drops below the 70% knock-in barrier at maturity, you absorb losses proportional to the drop. All accumulated Phoenix Memory coupons are forfeited. This is the worst-case scenario.",
  },
  {
    id: "how-settlement-works",
    question: "How do withdrawals work?",
    answer: "At maturity or autocall, the vault settles automatically. Your USDC principal plus any earned coupons are returned to your wallet.",
  },
  {
    id: "what-chain",
    question: "What chain is Phoenix on?",
    answer: "Phoenix is deployed on Ink Sepolia (testnet). You can try the full deposit, observation, and settlement flow using test tokens without real funds.",
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
