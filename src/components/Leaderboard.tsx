'use client'

import { useState, useMemo } from 'react'
import { useReadContract, useReadContracts } from 'wagmi'
import { base } from 'wagmi/chains'

const CHECKIN_CONTRACT_ADDRESS = '0x73A119f66397429CCc75cFfbD99c71673cC6DEae' as `0x${string}`

const ABI = [
  {
    "inputs": [],
    "name": "getAllUsers",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
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

interface UserStats {
  address: string
  streak: number
  lastCheckIn: number
}

export default function Leaderboard({ currentAddress }: { currentAddress?: string }) {
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 10
  
  // 1. Ambil SEMUA list address user
  const { data: allAddresses, isLoading: isLoadingList } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getAllUsers',
    chainId: base.id,
  })

  // 2. Logic Pagination: Tentukan index Awal dan Akhir
  const addressesToFetch = useMemo(() => {
    if (!allAddresses) return []
    const start = (page - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    // Slice array sesuai halaman aktif (Misal: 0-10, 10-20, dst)
    return allAddresses.slice(start, end)
  }, [allAddresses, page])

  // 3. Ambil data HANYA untuk 10 user di halaman ini
  const { data: userDataRaw, isLoading: isLoadingStats } = useReadContracts({
    contracts: addressesToFetch.map((addr) => ({
      address: CHECKIN_CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'getUserData',
      args: [addr],
      chainId: base.id
    })),
    query: { 
        enabled: addressesToFetch.length > 0,
        staleTime: 60 * 1000, 
    }
  })

  // 4. Format Data
  const leaderboardData = useMemo(() => {
    if (!addressesToFetch || !userDataRaw) return []

    const formatted: UserStats[] = addressesToFetch.map((addr, index) => {
      const result = userDataRaw[index]
      // @ts-expect-error handling wagmi type
      const stats = result?.status === 'success' ? (result.result as [bigint, bigint, bigint]) : [0, 0, 0]
      return {
        address: String(addr),
        streak: Number(stats ? stats[1] : 0),
        lastCheckIn: Number(stats ? stats[0] : 0)
      }
    })

    // Sorting berdasarkan Streak Tertinggi (Hanya untuk halaman ini)
    return formatted.sort((a, b) => b.streak - a.streak)
  }, [addressesToFetch, userDataRaw])

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  // Hitung Total Halaman
  const totalUsers = allAddresses ? allAddresses.length : 0
  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE)

  // Handler Ganti Halaman
  const handleNext = () => {
    if (page < totalPages) setPage(p => p + 1)
  }
  
  const handlePrev = () => {
    if (page > 1) setPage(p => p - 1)
  }

  const isLoading = isLoadingList || isLoadingStats

  return (
    <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <h2 style={{ margin: 0, color: '#fff' }}>🏆 Star Leaderboard</h2>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Total: {totalUsers} Users
            </div>
        </div>
        
        <div style={{ textAlign: 'left', minHeight: '300px' }}>
          {isLoading ? (
             <div className="animate-pulse">
                {[1,2,3,4,5].map(i => (
                    <div key={i} style={{height: '40px', background: 'rgba(255,255,255,0.05)', marginBottom: '8px', borderRadius: '8px'}}></div>
                ))}
            </div>
          ) : leaderboardData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No data yet</div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>#</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>User</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, idx) => {
                    // Hitung Ranking Global (berdasarkan halaman)
                    const globalRank = ((page - 1) * ITEMS_PER_PAGE) + idx + 1;
                    const isCurrentUser = user.address.toLowerCase() === currentAddress?.toLowerCase();

                    return (
                        <tr key={`${user.address}-${idx}`} style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.05)', 
                        background: isCurrentUser ? 'rgba(251, 191, 36, 0.1)' : 'transparent' 
                        }}>
                        <td style={{ padding: '12px 10px', width: '50px', color: '#94a3b8' }}>
                            {globalRank}
                        </td>
                        <td style={{ padding: '12px 10px', color: isCurrentUser ? '#fbbf24' : '#e2e8f0' }}>
                            {shortenAddress(user.address)}
                            {isCurrentUser && <span style={{ marginLeft: '6px', fontSize: '10px', background: '#d97706', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>YOU</span>}
                        </td>
                        <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', color: '#fff' }}>
                            {user.streak}
                        </td>
                        </tr>
                    )
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
        
        {/* --- PAGINATION CONTROLS (Geser Kanan/Kiri) --- */}
        {totalUsers > 0 && (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '16px', 
                marginTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                paddingTop: '16px'
            }}>
                <button 
                    onClick={handlePrev} 
                    disabled={page === 1 || isLoading}
                    style={{
                        background: page === 1 ? 'transparent' : 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: page === 1 ? '#64748b' : '#fff',
                        cursor: page === 1 ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center'
                    }}
                >
                    ← Prev
                </button>

                <span style={{ fontSize: '14px', color: '#cbd5e1' }}>
                    Page <strong style={{ color: '#fff' }}>{page}</strong> of {totalPages}
                </span>

                <button 
                    onClick={handleNext} 
                    disabled={page >= totalPages || isLoading}
                    style={{
                        background: page >= totalPages ? 'transparent' : 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: page >= totalPages ? '#64748b' : '#fff',
                        cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center'
                    }}
                >
                    Next →
                </button>
            </div>
        )}
      </div>
  )
}