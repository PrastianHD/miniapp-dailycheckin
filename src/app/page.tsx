'use client'

import React, { useState, useEffect } from 'react'
import { 
  useAccount, useReadContract, useWriteContract, 
  useWaitForTransactionReceipt, useChainId, useSwitchChain 
} from 'wagmi'
import Confetti from 'react-confetti' 
import toast, { Toaster } from 'react-hot-toast'
import { useWindowSize } from 'react-use'
import { base } from 'wagmi/chains'
import { formatEther } from 'viem'
import Link from 'next/link'
import Leaderboard from '@/components/Leaderboard'

// --- KONFIGURASI ---
const CHECKIN_CONTRACT_ADDRESS = '0x73A119f66397429CCc75cFfbD99c71673cC6DEae' as `0x${string}`

// URL untuk Share ke Warpcast
const SHARE_TEXT = encodeURIComponent("I just checked in on Daily Star! Building my streak to earn $STAR tokens🔥")
const SHARE_EMBED = encodeURIComponent("https://miniapp-dailycheckin.vercel.app")
const SHARE_URL = `https://warpcast.com/~/compose?text=${SHARE_TEXT}&embeds[]=${SHARE_EMBED}`

const ABI = [
  {
    "inputs": [],
    "name": "checkIn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getUserData",
    "outputs": [
      { "internalType": "uint256", "name": "lastCheckIn", "type": "uint256" },
      { "internalType": "uint256", "name": "streak", "type": "uint256" },
      { "internalType": "uint256", "name": "potentialReward", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

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

  // 1. Get User Data
  const { data: userData, refetch: refetchUser } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getUserData',
    args: address ? [address] : undefined,
    query: { enabled: !!address && chainId === base.id }
  })

  const lastCheckInTime = userData ? Number(userData[0]) : 0
  const currentStreak = userData ? Number(userData[1]) : 0
  const potentialReward = userData ? userData[2] : BigInt(0)

  // 2. Write Check-In
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
        toast.error(`Failed: ${writeError.message.split('\n')[0]}`, { position: 'top-center', style: { background: '#fee2e2', color: '#991b1b' } })
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
    writeContract({ address: CHECKIN_CONTRACT_ADDRESS, abi: ABI, functionName: 'checkIn' })
  }

  // Fungsi Share
  const handleShare = () => {
    window.open(SHARE_URL, '_blank', 'noopener,noreferrer')
  }

  if (!isClient) return null 

  return (
    <div className="container">
      <Toaster />
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.2} />}

      {/* --- MAIN CARD --- */}
      <div className="card" style={{ marginBottom: '24px', position: 'relative' }}>
        {/* Info Button */}
        <Link href="/info" style={{position: 'absolute', top: '20px', right: '20px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', zIndex: 10 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </Link>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        
        <h1>Daily Star Check-In</h1>
        <h2>Build Streak, Earn STAR</h2>

        <div className="header-actions"><appkit-button /></div>

        {!isConnected ? (
          <div className="status info">Connect wallet to start earning rewards! 🚀</div>
        ) : chainId !== base.id ? (
          <div className="status error">
            <p style={{marginBottom: '10px'}}>Wrong Network.</p>
            <button className="btn-primary" onClick={() => switchChain({ chainId: base.id })}>Switch to Base</button>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-label">Current Streak</div>
                <div className="stat-value">{currentStreak} 🔥</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Next Reward</div>
                <div className="stat-value" style={{ fontSize: '16px', color: '#fbbf24' }}>
                  {potentialReward > BigInt(0) ? `+${formatEther(potentialReward)} STAR` : (currentStreak < 3 ? "On Day 3" : "Next Milestone")}
                </div>
              </div>
            </div>
            <div style={{marginBottom: '20px', color: '#94a3b8', fontSize: '14px'}}>
               Next Check-in: <span style={{color: '#fff', fontWeight: 'bold'}}>{lastCheckInTime === 0 ? "Now" : getCountdown()}</span>
            </div>
            <button className="btn-primary" onClick={handleCheckIn} disabled={!canCheckIn || isPending || isConfirming} style={{ opacity: (!canCheckIn || isPending || isConfirming) ? 0.7 : 1 }}>
              {isPending ? 'Check Wallet...' : isConfirming ? 'Minting Rewards...' : canCheckIn ? 'Check In & Earn ✨' : 'Cooldown Active ⏳'}
            </button>
          </>
        )}
      </div>

      {/* --- LEADERBOARD --- */}
      <Leaderboard currentAddress={address} />

      {/* --- FOOTER: SHARE BUTTON --- */}
      <footer style={{ marginTop: '32px', paddingBottom: '40px', textAlign: 'center' }}>
        <button 
          onClick={handleShare}
          className="btn-primary"
          style={{ 
            background: 'linear-gradient(135deg, #7c3aed, #db2777)', // Gradient ungu-pink khas Farcaster
            boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            maxWidth: '280px'
          }}
        >
          {/* Ikon Share */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Share for Bonus
        </button>
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
          Share your streak on Farcaster & invite friends!
        </p>
      </footer>

    </div>
  )
}