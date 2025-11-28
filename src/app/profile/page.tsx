'use client'

import React from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { base } from 'wagmi/chains'
import { formatEther } from 'viem'
import BottomNav from '@/components/BottomNav'
import { useFarcaster } from '@/context/FarcasterContext'
import { CHECKIN_CONTRACT_ADDRESS, CHECKIN_ABI, STAR_TOKEN_ADDRESS, ERC20_ABI } from '@/constants'

export default function ProfilePage() {
  const { address } = useAccount()
  const farcasterState = useFarcaster()
  const context = farcasterState?.context
  
  // Fetch User Data
  const { data: userData } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: CHECKIN_ABI,
    functionName: 'getUserData',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  // Fetch Token Balance
  const { data: balance } = useReadContract({
    address: STAR_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  const currentStreak = userData && userData[1] ? Number(userData[1]) : 0
  const farcasterUser = context?.user

  const handleShare = () => {
    const text = encodeURIComponent("I just checked in on Daily Star! Building my streak to earn $STAR tokens! 🚀🔥")
    const embed = encodeURIComponent("https://miniapp-dailycheckin.vercel.app")
    window.open(`https://warpcast.com/~/compose?text=${text}&embeds[]=${embed}`, '_blank')
  }

  return (
    <div className="container" style={{paddingBottom: '100px'}}>
      <div style={{width: '100%', maxWidth: '480px'}}>
        <div className="card" style={{textAlign: 'left'}}>
          <h2 style={{color: '#fff', fontSize: '24px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px'}}>My Profile</h2>
          
          {/* User Info */}
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px'}}>
            {farcasterUser?.pfpUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={farcasterUser.pfpUrl} 
                alt="Profile" 
                style={{width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #8b5cf6', objectFit: 'cover'}} 
              />
            ) : (
              <div style={{width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', border: '2px solid rgba(255,255,255,0.2)'}}>
                👤
              </div>
            )}
            
            <div>
              <div style={{fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px'}}>Logged in as</div>
              
              {farcasterUser?.username ? (
                <div style={{color: '#fff', fontWeight: 'bold', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                  @{farcasterUser.username}
                  <span style={{fontSize: '14px'}}>🟣</span> 
                </div>
              ) : null}

              <div style={{color: farcasterUser?.username ? '#cbd5e1' : '#fff', fontFamily: 'monospace', fontSize: farcasterUser?.username ? '12px' : '16px', marginTop: '2px'}}>
                {address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'Not Connected'}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{display: 'grid', gap: '12px', marginBottom: '24px'}}>
            <div className="stat-box" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <div className="stat-label">Total Streak</div>
                <div className="stat-value">{currentStreak} Days</div>
              </div>
              <div style={{fontSize: '32px'}}>🔥</div>
            </div>

            <div className="stat-box" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(251, 191, 36, 0.3)', background: 'rgba(251, 191, 36, 0.05)'}}>
              <div>
                <div className="stat-label" style={{color: '#fbbf24'}}>STAR Balance</div>
                <div className="stat-value" style={{color: '#fbbf24'}}>
                  {balance ? parseFloat(formatEther(balance)).toFixed(2) : '0'} STAR
                </div>
              </div>
              <div style={{fontSize: '32px'}}>💰</div>
            </div>
          </div>

          {/* Share Button */}
          <button 
            onClick={handleShare}
            className="btn-primary"
            style={{ 
              background: 'linear-gradient(135deg, #7c3aed, #db2777)', 
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share Progress
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}