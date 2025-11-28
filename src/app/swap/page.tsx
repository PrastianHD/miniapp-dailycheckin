'use client'

import React from 'react'
import BottomNav from '@/components/BottomNav'

export default function SwapPage() {
  return (
    <div className="container" style={{paddingBottom: '100px'}}>
      <div style={{width: '100%', maxWidth: '480px'}}>
        <div className="card" style={{animation: 'fadeIn 0.5s', textAlign: 'center', padding: '60px 20px'}}>
          <div style={{background: 'rgba(255,255,255,0.05)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(255,255,255,0.1)'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
          </div>
          <h2 style={{color: '#fff', fontSize: '24px', marginBottom: '12px'}}>Token Swap</h2>
          <div style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#fff',
              display: 'inline-block',
              marginBottom: '24px',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
          }}>
              COMING SOON
          </div>
          <p style={{color: '#94a3b8', fontSize: '14px', lineHeight: '1.6'}}>
              We are building a seamless way to swap your earned STAR tokens directly within the app.
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}