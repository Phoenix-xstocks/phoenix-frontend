'use client'

import React from 'react';
import { FaTwitter, FaGithub, FaDiscord } from 'react-icons/fa';
import Image from 'next/image';

import '@/styles/landing-footer.css';

const LandingFooter: React.FC = () => {
  return (
    <div className="footer-container">
      <div className="footer-decorations">
        <div className="footer-decorations-top"></div>
        <div className="footer-decorations-bottom"></div>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Image src="/phoenix.svg" alt="Phoenix" width={36} height={36} className="opacity-80" />
              <span style={{ fontSize: '1.4rem', fontWeight: 500, color: 'white', letterSpacing: '-0.02em' }}>Phoenix</span>
            </div>
            <div className="footer-description">
              <p>Phoenix Protocol is a decentralized structured yield protocol built on Ethereum. It brings institutional-grade autocallable products onchain with trustless settlement via Chainlink CRE, offering two-sided perpetual vaults with coupon payoffs and barrier-based risk management.</p>
            </div>
            <div className="footer-social">
              <a href="https://discord.gg/" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="Discord community"><FaDiscord /></a>
              <a href="https://twitter.com/PhoenixProtocol" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X"><FaTwitter /></a>
              <a href="https://github.com/phoenix-protocol-labs" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository"><FaGithub /></a>
            </div>
          </div>

          <div className="footer-right">
            <div className="footer-right-section">
              <p>Resources</p>
              <ul>
                <li><a href="#product">Product</a></li>
                <li><a href="#Perks">Scenarios</a></li>
                <li><a href="#FAQ">FAQ</a></li>
              </ul>
            </div>
            <div className="footer-right-section">
              <p>Ecosystem</p>
              <ul>
                <li><a href="https://ethereum.org/" target="_blank" rel="noopener noreferrer">Ethereum</a></li>
                <li><a href="https://chain.link/" target="_blank" rel="noopener noreferrer">Chainlink</a></li>
              </ul>
            </div>
            <div className="footer-right-section">
              <p>Company</p>
              <ul>
                <li><a href="#" title="Coming soon">Privacy</a></li>
                <li><a href="#" title="Coming soon">Terms</a></li>
                <li><a href="mailto:contact@phoenix-protocol.fi">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export { LandingFooter };
export default LandingFooter;
