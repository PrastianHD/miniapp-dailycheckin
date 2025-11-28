'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { 
  useAccount, 
  useReadContract, 
  useReadContracts, 
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
import Link from 'next/link'

// --- CONFIGURATION ---
// Updated Contract Addresses
const CHECKIN_CONTRACT_ADDRESS = '0x73A119f66397429CCc75cFfbD99c71673cC6DEae' as `0x${string}`
// const STAR_TOKEN_ADDRESS = '0x0cAEAF5D806afBb3908B65aB695B62f0fFEA0955' as `0x${string}`

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
  },
  {
    "inputs": [],
    "name": "getAllUsers",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
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

  // --- 1. GET USER DATA (PERSONAL) ---
  const { data: userData, refetch: refetchUser } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getUserData',
    args: address ? [address] : undefined,
    query: { enabled: !!address && chainId === base.id }
  })

  // Data Parsing
  const lastCheckInTime = userData ? Number(userData[0]) : 0
  const currentStreak = userData ? Number(userData[1]) : 0
  const potentialReward = userData ? userData[2] : BigInt(0)

  // --- 2. GET ALL USERS (FOR LEADERBOARD) ---
  const { data: allAddresses, refetch: refetchAddressList } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getAllUsers',
    query: { enabled: chainId === base.id }
  })

  const { data: leaderboardRawData, refetch: refetchLeaderboardStats } = useReadContracts({
    contracts: (allAddresses || []).map((addr) => ({
      address: CHECKIN_CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'getUserData',
      args: [addr],
      chainId: base.id
    })),
    query: { enabled: !!allAddresses && allAddresses.length > 0 }
  })

  // Format Leaderboard Data
  const leaderboard = useMemo(() => {
    if (!allAddresses || !leaderboardRawData) return []

    const formatted = allAddresses.map((addr, index) => {
      const result = leaderboardRawData[index]

      const stats = result.status === 'success' ? (result.result as unknown as [bigint, bigint, bigint]) : [0, 0, 0]
      return {
        address: addr,
        streak: Number(stats[1]),
        lastCheckIn: Number(stats[0])
      }
    })

    return formatted.sort((a, b) => b.streak - a.streak).slice(0, 10)
  }, [allAddresses, leaderboardRawData])


  // --- 3. WRITE CHECK-IN ---
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isConfirmed) {
      const hasReward = potentialReward > BigInt(0)
      const msg = hasReward 
        ? `Check-in Success! You earned ${formatEther(potentialReward)} STAR Tokens! 🌟` 
        : "Check-in successful! Streak updated 🔥"

      toast.success(msg, {
        duration: 6000,
        position: 'top-center',
        style: { background: hasReward ? '#fef08a' : '#dcfce7', color: hasReward ? '#854d0e' : '#166534', fontWeight: 'bold' },
        icon: hasReward ? '💰' : '✅'
      })
      
      setShowConfetti(true)
      refetchUser()
      refetchAddressList()
      refetchLeaderboardStats()
      setTimeout(() => setShowConfetti(false), 7000)
    }
    if (writeError) {
      const msg = writeError.message.split('\n')[0] || "Transaction failed"
      toast.error(`Failed: ${msg}`, { position: 'top-center', style: { background: '#fee2e2', color: '#991b1b' } })
    }
  }, [isConfirmed, writeError, refetchUser, refetchAddressList, refetchLeaderboardStats, potentialReward])

  // --- TIME LOGIC ---
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

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const handleCheckIn = () => {
    if (!isConnected) return
    if (chainId !== base.id) {
      switchChain({ chainId: base.id })
      return
    }
    writeContract({
      address: CHECKIN_CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'checkIn',
    })
  }

  if (!isClient) return null 

  return (
    <div className="container">
      <Toaster />
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.2} />}

      {/* --- MAIN CARD --- */}
      <div className="card" style={{ marginBottom: '24px', position: 'relative' }}>
        
        {/* --- INFO BUTTON --- */}
        <Link 
          href="/info" 
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cbd5e1',
            transition: 'all 0.2s',
            cursor: 'pointer',
            zIndex: 10
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff' }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#cbd5e1' }}
          title="Project Information"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </Link>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="url(#grad1)">
             <defs>
               <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" style={{stopColor:'#fbbf24', stopOpacity:1}} />
                 <stop offset="100%" style={{stopColor:'#d97706', stopOpacity:1}} />
               </linearGradient>
             </defs>
             <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
           </svg>
        </div>
        
        <h1>Daily Star Check-In</h1>
        <h2>Build Streak, Earn STAR</h2>

        <div className="header-actions">
          <appkit-button />
        </div>

        {!isConnected ? (
          <div className="status info">Connect wallet to start earning rewards! 🚀</div>
        ) : chainId !== base.id ? (
          <div className="status error">
            <p style={{marginBottom: '10px'}}>Wrong Network. Switch to Base.</p>
            <button className="btn-primary" onClick={() => switchChain({ chainId: base.id })}>Switch Network</button>
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

            <button 
              className="btn-primary"
              onClick={handleCheckIn}
              disabled={!canCheckIn || isPending || isConfirming}
              style={{ opacity: (!canCheckIn || isPending || isConfirming) ? 0.7 : 1 }}
            >
              {isPending ? 'Check Wallet...' : isConfirming ? 'Minting Rewards...' : canCheckIn ? 'Check In & Earn ✨' : 'Cooldown Active ⏳'}
            </button>
          </>
        )}
      </div>

      {/* --- LEADERBOARD CARD --- */}
      <div className="card">
        <h2 style={{ marginBottom: '16px', color: '#fff' }}>🏆 Star Leaderboard</h2>
        
        <div style={{ textAlign: 'left' }}>
          {leaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
              {isConnected ? "Be the first to check in!" : "Connect to see leaderboard"}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Rank</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>User</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Streak</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, idx) => (
                  <tr key={user.address} style={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.05)', 
                    background: user.address === address ? 'rgba(251, 191, 36, 0.1)' : 'transparent' 
                  }}>
                    <td style={{ padding: '12px 10px', width: '50px' }}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </td>
                    <td style={{ padding: '12px 10px', color: user.address === address ? '#fbbf24' : '#e2e8f0', fontWeight: user.address === address ? 'bold' : 'normal' }}>
                      {shortenAddress(user.address)}
                      {user.address === address && <span style={{ marginLeft: '6px', fontSize: '10px', background: '#d97706', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>YOU</span>}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', color: '#fff' }}>
                      {user.streak}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}