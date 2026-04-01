'use client'

import React, { useState } from 'react';

import '@/styles/landing-faq.css';

interface IFaqItem {
  id: string;
  question: string;
  answer: string;
  theme: string;
}

const LANDING_FAQ_IDS: string[] = [
  'what-is-phoenix',
  'how-it-works',
  'supported-assets',
  'getting-started'
];

const FAQ_ITEMS: IFaqItem[] = [
  {
    id: 'what-is-phoenix',
    question: 'What is Phoenix Protocol?',
    answer: 'Phoenix Protocol brings institutional-grade autocallable structured products onchain. Perpetual two-sided vaults with coupon payoffs, barrier logic, and fully automated settlement powered by Chainlink CRE.',
    theme: 'General'
  },
  {
    id: 'how-it-works',
    question: 'How do perpetual vaults work?',
    answer: 'Each vault has two sides: Side A deposits the underlying asset and earns USDC coupons, Side B deposits USDC and profits from knock-in events. Chainlink CRE evaluates price barriers each period and settles automatically. Cycles reset perpetually with a new strike.',
    theme: 'Usage'
  },
  {
    id: 'supported-assets',
    question: 'What assets are supported?',
    answer: '19 vaults across 5 categories: Spot (ETH, BTC, SOL, stETH, wstETH), Perps (ETH, BTC, SOL via Hyperliquid), Yield tokens (Pendle YT), Rates (Aave supply rates), and Equities (TSLA, AAPL, NVDA via xStocks).',
    theme: 'Usage'
  },
  {
    id: 'getting-started',
    question: 'How do I get started?',
    answer: 'Connect your wallet on Ethereum Sepolia, choose Earn (Side A) or Hedge (Side B), browse vaults, and deposit. The protocol handles observations, coupons, and cycle resets automatically.',
    theme: 'Usage'
  },
];

const LandingFaq: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setExpandedId(currentExpandedId => (currentExpandedId === id ? null : id));
  };

  const displayedItems = FAQ_ITEMS.filter(item => LANDING_FAQ_IDS.includes(item.id)).sort((a, b) => LANDING_FAQ_IDS.indexOf(a.id) - LANDING_FAQ_IDS.indexOf(b.id));

  return (
    <section className="faq" id="FAQ">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
        </div>
        <div className="faq-content">
          <div className="faq-list">
            {displayedItems.map(item => (
              <div
                key={item.id}
                className={`faq-item ${expandedId === item.id ? 'expanded' : ''}`}
              >
                <div className="faq-item-content">
                  <div
                    className="faq-question"
                    onClick={() => toggleItem(item.id)}
                  >
                    <span className="faq-toggle"></span>
                    <h3 className="faq-question-text">{item.question}</h3>
                  </div>
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="faq-cta">
            <a href="/faq" className="phoenix-link">
              <span className="phoenix-link-text">See more FAQs</span>
              <span className="arrow-icon"></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { LandingFaq };
export default LandingFaq;
