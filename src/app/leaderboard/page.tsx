'use client'

import React from 'react'
import { useAccount } from 'wagmi'
import Leaderboard from '@/components/Leaderboard'
import BottomNav from '@/components/BottomNav'

export default function LeaderboardPage() {
  const { address } = useAccount()
  
  return (
    <div className="container" style={{paddingBottom: '100px'}}>
      <div style={{width: '100%', maxWidth: '480px'}}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Rankings</h1>
        </div>
        
        <Leaderboard currentAddress={address} />
      </div>
      <BottomNav />
    </div>
  )
}