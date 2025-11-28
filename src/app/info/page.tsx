'use client'

import React from 'react'
import BottomNav from '@/components/BottomNav'

export default function InfoPage() {
  return (
    <div className="container" style={{ paddingBottom: '100px' }}>
      <div className="card" style={{ maxWidth: '100%', textAlign: 'left', padding: '24px 20px' }}>
        
        <h1 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '800' }}>Project Details</h1>

        {/* Content Section 1 */}
        <div className="stat-box" style={{ marginBottom: '20px', padding: '20px' }}>
          <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '18px' }}>🌟 What is Daily Star?</h3>
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.5' }}>
            Daily check-in app on Base Mainnet. Build a streak and maintain it for up to 100 days to win the $STAR jackpot.
          </p>
        </div>

        {/* Content Section 2 */}
        <div className="stat-box" style={{ marginBottom: '20px', padding: '20px' }}>
          <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '18px' }}>📜 Rules</h3>
          <ul style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', paddingLeft: '20px' }}>
            <li><strong>Cooldown:</strong> Check in once every 24 hours.</li>
            <li><strong>Streak Reset:</strong> Miss &gt; 48 hours, streak resets.</li>
            <li><strong>Gas Fee:</strong> Tiny ETH (Base) required.</li>
          </ul>
        </div>

        {/* Content Section 3 */}
        <div className="stat-box" style={{ padding: '20px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
          <h3 style={{ color: '#fbbf24', marginBottom: '12px', fontSize: '18px' }}>💰 Rewards</h3>
           <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.8' }}>
            Day 3 : 100 STAR<br/>
            Day 7 : 500 STAR<br/>
            Day 30 : 5,000 STAR<br/>
            Day 50 : 50,000 STAR<br/>
            Day 100 : 500,000 STAR
          </p>
        </div>

      </div>
      <BottomNav />
    </div>
  )
}