'use client'

import Link from 'next/link'
import React from 'react'

export default function InfoPage() {
  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', textAlign: 'left' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <Link href="/" className="btn-icon">
            {/* Back Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#cbd5e1' }}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 style={{ margin: '0 0 0 16px', fontSize: '24px' }}>Project Details</h1>
        </div>

        {/* Content Section 1: Intro */}
        <div className="stat-box" style={{ marginBottom: '16px' }}>
          <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '18px' }}>🌟 What is Daily Star?</h3>
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
            Daily Star is a blockchain-based Check-In application on <strong>Base Mainnet</strong>. 
            Build consistent habits (streaks) to earn rewards in the form of <strong>STAR Tokens</strong>.
          </p>
        </div>

        {/* Content Section 2: Rules */}
        <div className="stat-box" style={{ marginBottom: '16px' }}>
          <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '18px' }}>📜 Rules & Mechanism</h3>
          <ul style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>
              <strong>Cooldown:</strong> You can only check in once every <strong>24 hours</strong>.
            </li>
            <li>
              <strong>Streak Reset:</strong> If you miss a check-in for more than <strong>48 hours</strong> (skip 1 day), your streak will reset to 0.
            </li>
            <li>
              <strong>Gas Fee:</strong> A small amount of ETH (Base) is required for each check-in transaction.
            </li>
          </ul>
        </div>

        {/* Content Section 3: Rewards */}
        <div className="stat-box" style={{ marginBottom: '16px', border: '1px solid rgba(251, 191, 36, 0.3)', background: 'rgba(251, 191, 36, 0.05)' }}>
          <h3 style={{ color: '#fbbf24', marginBottom: '12px', fontSize: '18px' }}>💰 Airdrop & Rewards</h3>
          <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '10px' }}>
            The Smart Contract will automatically send STAR Tokens (Mint/Airdrop) directly to your wallet when you reach these milestones:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Day 3</div>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>100 STAR</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Day 7</div>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>500 STAR</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Day 30</div>
              <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>5000 STAR</div>
            </div>
          </div>
        </div>

        {/* Content Section 4: Tokenomics */}
        <div className="stat-box">
          <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '18px' }}>💎 Tokenomics</h3>
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
            <strong>Token Name:</strong> Star Token (STAR)<br/>
            <strong>Supply:</strong> 100M<br/>
            <strong>Network:</strong> Base Mainnet<br/>
            <strong>Contract:</strong> <span style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '4px' }}>0x0cAEAF5D806afBb3908B65aB695B62f0fFEA0955</span>
          </p>
        </div>

      </div>
    </div>
  )
}