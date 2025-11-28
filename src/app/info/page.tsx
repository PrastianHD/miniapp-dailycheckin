'use client'

import Link from 'next/link'
import React from 'react'

export default function InfoPage() {
  return (
    <div className="container" style={{ padding: '16px' }}> {/* Padding container diperkecil untuk mobile */}
      <div className="card" style={{ maxWidth: '100%', textAlign: 'left', padding: '24px 20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
          <Link href="/" className="btn-icon" style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            {/* Back Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#fff' }}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 style={{ margin: '0 0 0 16px', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>Project Details</h1>
        </div>

        {/* Content Section 1: Intro */}
        <div className="stat-box" style={{ marginBottom: '20px', padding: '20px' }}>
          <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌟</span> What is Daily Star?
          </h3>
          <p style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: '1.6', fontWeight: '400' }}>
            Daily Star is a blockchain-based Check-In application on <strong style={{ color: '#60a5fa' }}>Base Mainnet</strong>. 
            Build consistent habits (streaks) to earn rewards in the form of <strong>STAR Tokens</strong>.
          </p>
        </div>

        {/* Content Section 2: Rules */}
        <div className="stat-box" style={{ marginBottom: '20px', padding: '20px' }}>
          <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📜</span> Rules & Mechanism
          </h3>
          <ul style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: '1.7', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <strong>Cooldown:</strong> Check in once every <strong>24 hours</strong>.
            </li>
            <li>
              <strong>Streak Reset:</strong> Miss check-in <strong>48 hours</strong>? Streak resets to 0.
            </li>
            <li>
              <strong>Gas Fee:</strong> Tiny ETH (Base) needed for transaction.
            </li>
          </ul>
        </div>

        {/* Content Section 3: Rewards */}
        <div className="stat-box" style={{ marginBottom: '20px', border: '1px solid rgba(251, 191, 36, 0.4)', background: 'rgba(251, 191, 36, 0.08)', padding: '20px' }}>
          <h3 style={{ color: '#fbbf24', marginBottom: '12px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💰</span> Airdrop & Rewards
          </h3>
          <p style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>
            Smart Contract automatically sends STAR Tokens directly to your wallet at milestones:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Day 3</div>
              <div style={{ color: '#fff', fontWeight: '800', fontSize: '16px' }}>100 STAR</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Day 7</div>
              <div style={{ color: '#fff', fontWeight: '800', fontSize: '16px' }}>500 STAR</div>
            </div>
            <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '12px 8px', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
              <div style={{ fontSize: '11px', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '4px' }}>Day 30</div>
              <div style={{ color: '#fbbf24', fontWeight: '800', fontSize: '16px' }}>5000 STAR</div>
            </div>
          </div>
        </div>

        {/* Content Section 4: Tokenomics */}
        <div className="stat-box" style={{ padding: '20px' }}>
          <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💎</span> Tokenomics
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Token Name</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>Star Token (STAR)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Total Supply</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>1 Billion (Mintable)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Network</span>
              <span style={{ color: '#60a5fa', fontWeight: '600', fontSize: '14px' }}>Base Mainnet</span>
            </div>
            <div style={{ marginTop: '4px' }}>
              <span style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Contract Address</span>
              <div style={{ 
                fontFamily: 'monospace', 
                background: 'rgba(0,0,0,0.3)', 
                padding: '10px', 
                borderRadius: '8px', 
                fontSize: '11px', 
                color: '#cbd5e1',
                wordBreak: 'break-all',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                0x0cAEAF5D806afBb3908B65aB695B62f0fFEA0955
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}