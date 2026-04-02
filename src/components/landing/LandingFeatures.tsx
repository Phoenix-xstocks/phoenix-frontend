'use client'

import React from 'react';

interface IFeature {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
}

const FEATURES_LIST: IFeature[] = [
  {
    id: 'bull',
    title: 'Bull Market: Early Redemption',
    description: 'The basket rallies above the autocall barrier. The vault closes early, and you collect all accrued coupons plus your principal.',
    videoSrc: '/bull-market-early-redemption.mp4'
  },
  {
    id: 'bear-protected',
    title: 'Bear Market: Capital Protection',
    description: 'The worst-of index drops but stays above the knock-in barrier. Your capital is fully protected, you get back 100% of your deposit.',
    videoSrc: '/bear-market-capital-protection.mp4'
  },
  {
    id: 'bear-loss',
    title: 'Bear Market — Capital Loss',
    description: 'The worst-performing index crashes below the knock-in barrier at maturity. You absorb losses proportional to the drop, the worst-case scenario.',
    videoSrc: '/bear-market-capital-loss.mp4'
  }
];

import '@/styles/landing-features.css';

const LandingFeatures: React.FC = () => {
  return (
    <section className="features-section" id="Perks">
      <div className="features-decorations">
        <div className="decoration-top-features"></div>
        <div className="decoration-bottom-features"></div>
      </div>
      <div className="features-container">
        <div className="features-container-inner">
          <div className="features-left-column">
            <p className="features-main-title">Structured for Every Scenario.</p>
            <p className="features-main-subtitle">See how your capital performs in bull,<br />bear, and worst-case scenarios.</p>
          </div>
          <div className="features-right-column">
            {FEATURES_LIST.map((feature) => (
              <div key={feature.id}>
                <div className="feature-video" style={{ padding: 0, background: 'transparent' }}>
                  <video
                    autoPlay
                    muted
                    playsInline
                    style={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block' }}
                    ref={(el) => {
                      if (!el) return
                      el.onended = () => {
                        setTimeout(() => {
                          el.currentTime = 0
                          el.play()
                        }, 10000)
                      }
                    }}
                  >
                    <source src={feature.videoSrc} type="video/mp4" />
                  </video>
                </div>
                <h3 className="feature-item-title">{feature.title}</h3>
                <p className="feature-item-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { LandingFeatures };
export default LandingFeatures;
