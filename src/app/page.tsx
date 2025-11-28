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
import Leaderboard from '@/components/Leaderboard'
import Link from 'next/link'

// --- KONFIGURASI ALAMAT ---
const CHECKIN_CONTRACT_ADDRESS = '0x73A119f66397429CCc75cFfbD99c71673cC6DEae' as `0x${string}`
const STAR_TOKEN_ADDRESS = '0x0cAEAF5D806afBb3908B65aB695B62f0fFEA0955' as `0x${string}`

// --- TIPE DATA ---
type UserData = readonly [bigint, bigint, bigint] | undefined;

interface HomeViewProps {
  userData: UserData;
  onCheckIn: () => void;
  isPending: boolean;
  isConfirming: boolean;
  lastCheckInTime: number;
  getCountdown: () => string;
}

interface ProfileViewProps {
  address: string | undefined;
  userData: UserData;
  onShare: () => void;
}

// --- ABI KONTRAK ---
const CHECKIN_ABI = [
  { "inputs": [], "name": "checkIn", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "getUserData", "outputs": [{ "internalType": "uint256", "name": "lastCheckIn", "type": "uint256" }, { "internalType": "uint256", "name": "streak", "type": "uint256" }, { "internalType": "uint256", "name": "potentialReward", "type": "uint256" }], "stateMutability": "view", "type": "function" }
] as const;

const ERC20_ABI = [
  { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
] as const;

// --- ICONS (SVG) ---
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
)
const TrophyIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
)
const SwapIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
)
const InfoIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="8"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
)
const UserIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)

// --- COMPONENT: HOME VIEW ---
const HomeView = ({ userData, onCheckIn, isPending, isConfirming, lastCheckInTime, getCountdown }: HomeViewProps) => {
  const currentStreak = userData ? Number(userData[1]) : 0
  const potentialReward = userData ? userData[2] : BigInt(0)
  const now = Date.now()
  const COOLDOWN = 86400 
  const nextCheckInTimestamp = (lastCheckInTime + COOLDOWN) * 1000 
  const canCheckIn = lastCheckInTime === 0 || now >= nextCheckInTimestamp

  return (
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
        onClick={onCheckIn}
        disabled={!canCheckIn || isPending || isConfirming}
        style={{ 
          opacity: (!canCheckIn || isPending || isConfirming) ? 0.7 : 1, 
          height: '56px', fontSize: '18px' 
        }}
      >
        {isPending ? 'Check Wallet...' : isConfirming ? 'Minting...' : canCheckIn ? 'Check In Now ✨' : 'Cooldown Active ⏳'}
      </button>
    </div>
  )
}

// --- COMPONENT: SWAP VIEW (COMING SOON) ---
const SwapView = () => (
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
)

// --- COMPONENT: PROFILE VIEW ---
const ProfileView = ({ address, userData, onShare }: ProfileViewProps) => {
  const { data: balance } = useReadContract({
    address: STAR_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    // FIX: Pastikan address di-cast sebagai 0x string
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address }
  })

  const currentStreak = userData ? Number(userData[1]) : 0

  return (
    <div className="card" style={{animation: 'fadeIn 0.5s', textAlign: 'left'}}>
      <h2 style={{color: '#fff', fontSize: '24px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px'}}>My Profile</h2>
      
      {/* User Info */}
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'}}>
        <div style={{width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'}}>
          👤
        </div>
        <div>
          <div style={{fontSize: '12px', color: '#94a3b8'}}>Connected As</div>
          <div style={{color: '#fff', fontFamily: 'monospace', fontSize: '16px'}}>
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
        onClick={onShare}
        className="btn-primary"
        style={{ 
          background: 'linear-gradient(135deg, #7c3aed, #db2777)', 
          boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        Share Refferal on Warpcast
      </button>
    </div>
  )
}

// --- COMPONENT: INFO VIEW (Updated Content) ---
const InfoView = () => (
  <div className="card" style={{animation: 'fadeIn 0.5s', textAlign: 'left'}}>
    <h2 style={{color: '#fff', fontSize: '24px', marginBottom: '20px'}}>Information</h2>
    
    <div className="stat-box" style={{ marginBottom: '16px' }}>
      <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>🌟 What is Daily Star?</h3>
      {/* Updated Description */}
      <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.5' }}>
        Daily check-in app on Base Mainnet. Build a streak and maintain it for up to 100 days to win the $STAR jackpot.
      </p>
    </div>

    <div className="stat-box" style={{ marginBottom: '16px' }}>
      <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>📜 Rules</h3>
      <ul style={{ color: '#cbd5e1', fontSize: '14px', paddingLeft: '20px' }}>
        <li>Cooldown: 24 hours.</li>
        <li>Reset: Miss {'>'} 48 hours resets streak.</li>
      </ul>
    </div>

    <div className="stat-box" style={{ border: '1px solid rgba(251, 191, 36, 0.3)' }}>
      <h3 style={{ color: '#fbbf24', fontSize: '16px', marginBottom: '8px' }}>💰 Rewards</h3>
      {/* Updated Rewards List */}
      <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.8' }}>
        Day 3 : 100 STAR<br/>
        Day 7 : 500 STAR<br/>
        Day 30 : 5,000 STAR<br/>
        Day 50 : 50,000 STAR<br/>
        Day 100 : 500,000 STAR
      </p>
    </div>
  </div>
)

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'leaderboard' | 'swap' | 'info' | 'profile'>('home')
  
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

  // Fetch Data User
  const { data: userData, refetch: refetchUser } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: CHECKIN_ABI,
    functionName: 'getUserData',
    // FIX: Explicit casting untuk args
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address && chainId === base.id }
  })

  const lastCheckInTime = userData ? Number(userData[0]) : 0
  const potentialReward = userData ? userData[2] : BigInt(0)

  // Write Contract
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

  // Share Function
  const handleShare = () => {
    const text = encodeURIComponent("I just checked in on Daily Star! Building my streak to earn $STAR tokens! 🚀🔥")
    const embed = encodeURIComponent("https://miniapp-dailycheckin.vercel.app")
    window.open(`https://warpcast.com/~/compose?text=${text}&embeds[]=${embed}`, '_blank')
  }

  const handleCheckIn = () => {
    if (!isConnected) return
    if (chainId !== base.id) { switchChain({ chainId: base.id }); return; }
    writeContract({ address: CHECKIN_CONTRACT_ADDRESS, abi: CHECKIN_ABI, functionName: 'checkIn' })
  }

  const getCountdown = () => {
    const COOLDOWN = 86400 
    const nextCheckInTimestamp = (lastCheckInTime + COOLDOWN) * 1000 
    const diff = nextCheckInTimestamp - now
    if (diff < 0) return "Ready!"
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  if (!isClient) return null 

  return (
    <div className="container" style={{paddingBottom: '100px'}}>
      <Toaster />
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.2} />}

      {/* --- CONTENT AREA --- */}
      <div style={{width: '100%', maxWidth: '480px'}}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
           <div style={{fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px'}}>
             <span>⭐ Daily Star</span>
           </div>
           {/* INFO BUTTON */}
           {activeTab === 'home' && (
             <Link href="/info" style={{width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', marginLeft: 'auto', marginRight: '10px'}}>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
             </Link>
           )}
           <appkit-button />
        </div>

        {/* VIEW RENDERER */}
        {activeTab === 'home' && (
          <HomeView 
            userData={userData} 
            onCheckIn={handleCheckIn} 
            isPending={isPending} 
            isConfirming={isConfirming} 
            lastCheckInTime={lastCheckInTime} 
            getCountdown={getCountdown}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard currentAddress={address} />
        )}

        {activeTab === 'swap' && (
          <SwapView />
        )}

        {activeTab === 'info' && (
          <InfoView />
        )}

        {activeTab === 'profile' && (
          <ProfileView 
            address={address} 
            userData={userData} 
            onShare={handleShare} 
          />
        )}

      </div>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0 16px 0',
        zIndex: 100,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.3)'
      }}>
        <button onClick={() => setActiveTab('home')} style={{background: 'none', border: 'none', color: activeTab === 'home' ? '#60a5fa' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '10px', flex: 1}}>
          <HomeIcon active={activeTab === 'home'} />
          Home
        </button>
        <button onClick={() => setActiveTab('leaderboard')} style={{background: 'none', border: 'none', color: activeTab === 'leaderboard' ? '#fbbf24' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '10px', flex: 1}}>
          <TrophyIcon active={activeTab === 'leaderboard'} />
          Ranks
        </button>
        <button onClick={() => setActiveTab('swap')} style={{background: 'none', border: 'none', color: activeTab === 'swap' ? '#22c55e' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '10px', flex: 1}}>
          <SwapIcon active={activeTab === 'swap'} />
          Swap
        </button>
        <button onClick={() => setActiveTab('info')} style={{background: 'none', border: 'none', color: activeTab === 'info' ? '#a78bfa' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '10px', flex: 1}}>
          <InfoIcon active={activeTab === 'info'} />
          Info
        </button>
        <button onClick={() => setActiveTab('profile')} style={{background: 'none', border: 'none', color: activeTab === 'profile' ? '#f472b6' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '10px', flex: 1}}>
          <UserIcon active={activeTab === 'profile'} />
          Profile
        </button>
      </div>

    </div>
  )
}