'use client'

import React, { useState, useEffect } from 'react'
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt, 
  useChainId, 
  useSwitchChain 
} from 'wagmi'
import Confetti from 'react-confetti' 
import toast, { Toaster } from 'react-hot-toast'
import { useWindowSize } from 'react-use'
import { base } from 'wagmi/chains'
import { formatEther } from 'viem'
import BottomNav from '@/components/BottomNav'
import { CHECKIN_CONTRACT_ADDRESS, CHECKIN_ABI } from '@/constants'

export default function Home() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { width, height } = useWindowSize()
  const [now, setNow] = useState<number>(Date.now())
  const [isClient, setIsClient] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const { data: userData, refetch: refetchUser } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: CHECKIN_ABI,
    functionName: 'getUserData',
    args: address ? [address] : undefined,
    query: { enabled: !!address && chainId === base.id }
  })

  // Parsing BigInt dengan aman
  const lastCheckInTime = userData && userData[0] ? Number(userData[0]) : 0
  const currentStreak = userData && userData[1] ? Number(userData[1]) : 0
  const potentialReward = userData && userData[2] ? userData[2] : BigInt(0)

  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isConfirmed) {
      const hasReward = potentialReward > BigInt(0)
      toast.success(hasReward ? "Reward Claimed! 💰" : "Check-in successful! 🔥", { 
        duration: 5000, 
        position: 'top-center',
        style: { background: '#dcfce7', color: '#166534', fontWeight: 'bold' }
      })
      setShowConfetti(true)
      refetchUser()
      setTimeout(() => setShowConfetti(false), 7000)
    }
    if (writeError) {
        toast.error(`Failed: ${writeError.message.split('\n')[0]}`, { position: 'top-center' })
    }
  }, [isConfirmed, writeError, refetchUser, potentialReward])

  const COOLDOWN = 86400 
  const nextCheckInTimestamp = (lastCheckInTime + COOLDOWN) * 1000 
  const canCheckIn = lastCheckInTime === 0 || now >= nextCheckInTimestamp
  
  const getCountdown = () => {
    if (canCheckIn) return "Ready!"
    const diff = nextCheckInTimestamp - now
    if (diff < 0) return "Ready!"
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const handleCheckIn = () => {
    if (!isConnected) return
    if (chainId !== base.id) { switchChain({ chainId: base.id }); return; }
    writeContract({ address: CHECKIN_CONTRACT_ADDRESS, abi: CHECKIN_ABI, functionName: 'checkIn' })
  }

  if (!isClient) return null 

  return (
    <div className="container" style={{paddingBottom: '100px'}}>
      <Toaster />
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.2} />}

      <div style={{width: '100%', maxWidth: '480px'}}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
           <div style={{fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px'}}>
             <span>⭐ Daily Star</span>
           </div>
           <appkit-button />
        </div>

        {/* HOME VIEW */}
        <div className="card" style={{animation: 'fadeIn 0.5s'}}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80" fill="url(#grad1)">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor:'#fbbf24', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#d97706', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
          </div>
          
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Daily Check-In</h1>
          <h2 style={{ fontSize: '14px', marginBottom: '30px' }}>Build Streak, Earn STAR</h2>

          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-label">Current Streak</div>
              <div className="stat-value" style={{fontSize: '32px'}}>{currentStreak} 🔥</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Next Reward</div>
              <div className="stat-value" style={{ fontSize: '16px', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38px' }}>
                {potentialReward > BigInt(0) ? `+${formatEther(potentialReward)} STAR` : (currentStreak < 3 ? "On Day 3" : "Next Milestone")}
              </div>
            </div>
          </div>

          <div style={{marginBottom: '24px', color: '#cbd5e1', fontSize: '14px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px'}}>
              Status: <span style={{color: canCheckIn ? '#86efac' : '#fca5a5', fontWeight: 'bold'}}>{canCheckIn ? "Ready" : "Cooldown"}</span>
              <br/>
              <span style={{fontSize: '18px', fontWeight: 'bold', color: '#fff', marginTop: '4px', display: 'block'}}>
                {lastCheckInTime === 0 ? "Start Now!" : getCountdown()}
              </span>
          </div>

          <button 
            className="btn-primary"
            onClick={handleCheckIn}
            disabled={!canCheckIn || isPending || isConfirming}
            style={{ opacity: (!canCheckIn || isPending || isConfirming) ? 0.7 : 1, height: '56px', fontSize: '18px' }}
          >
            {isPending ? 'Check Wallet...' : isConfirming ? 'Minting...' : canCheckIn ? 'Check In Now ✨' : 'Cooldown Active ⏳'}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}