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
    answer: 'Phoenix brings institutional autocallable structured products onchain. Deposit USDC into a worst-of vault on tokenized indices (SPY/QQQ), earn periodic coupons with built-in downside protection, fully settled on Ink.',
    theme: 'General'
  },
  {
    id: 'how-it-works',
    question: 'How does the vault work?',
    answer: 'You deposit USDC. Every month, the protocol checks if SPY and QQQ are above 70% of their starting price. If yes, you earn a coupon. If both are above 100%, you get your capital back early (autocall). At maturity, if neither dropped below 70%, you get everything back.',
    theme: 'Usage'
  },
  {
    id: 'supported-assets',
    question: 'What assets are supported?',
    answer: 'Currently one vault: worst-of basket on the S&P 500 (wSPYx) and Nasdaq 100 (wQQQx), powered by xStocks tokenized indices on Ink.',
    theme: 'Usage'
  },
  {
    id: 'getting-started',
    question: 'How do I get started?',
    answer: 'Connect your wallet on Ink, deposit USDC (minimum $100), and the protocol handles observations, coupons, and settlement automatically.',
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
