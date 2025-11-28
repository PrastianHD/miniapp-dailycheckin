'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Icons
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

export default function BottomNav() {
  const pathname = usePathname()

  return (
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
      padding: '10px 0 20px 0',
      zIndex: 100,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3)'
    }}>
      <Link href="/" style={{color: pathname === '/' ? '#60a5fa' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '10px', flex: 1, textDecoration: 'none'}}>
        <HomeIcon active={pathname === '/'} />
        Home
      </Link>
      <Link href="/leaderboard" style={{color: pathname === '/leaderboard' ? '#fbbf24' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '10px', flex: 1, textDecoration: 'none'}}>
        <TrophyIcon active={pathname === '/leaderboard'} />
        Ranks
      </Link>
      <Link href="/swap" style={{color: pathname === '/swap' ? '#22c55e' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '10px', flex: 1, textDecoration: 'none'}}>
        <SwapIcon active={pathname === '/swap'} />
        Swap
      </Link>
      <Link href="/info" style={{color: pathname === '/info' ? '#a78bfa' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '10px', flex: 1, textDecoration: 'none'}}>
        <InfoIcon active={pathname === '/info'} />
        Info
      </Link>
      <Link href="/profile" style={{color: pathname === '/profile' ? '#f472b6' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '10px', flex: 1, textDecoration: 'none'}}>
        <UserIcon active={pathname === '/profile'} />
        Profile
      </Link>
    </div>
  )
}