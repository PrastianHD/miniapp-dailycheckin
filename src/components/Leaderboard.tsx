'use client'

import { useMemo } from 'react'
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

export default function Leaderboard({ currentAddress }: { currentAddress?: string }) {
  // 1. Ambil list user
  const { data: allAddresses, isLoading: isLoadingList } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getAllUsers',
    chainId: base.id,
  })

  // 2. Ambil detail stats (Batching)
  const { data: leaderboardRawData, isLoading: isLoadingStats } = useReadContracts({
    contracts: (allAddresses || []).map((addr) => ({
      address: CHECKIN_CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'getUserData',
      args: [addr],
      chainId: base.id
    })),
    query: { 
        enabled: !!allAddresses && allAddresses.length > 0,
        staleTime: 60 * 1000, // Cache data selama 1 menit agar tidak fetch ulang terus
    }
  })

  const leaderboard = useMemo(() => {
    if (!allAddresses || !leaderboardRawData) return []

    const formatted = allAddresses.map((addr, index) => {
      const result = leaderboardRawData[index]
      // @ts-expect-error handling type
      const stats = result.status === 'success' ? (result.result as [bigint, bigint, bigint]) : [0, 0, 0]
      return {
        address: addr,
        streak: Number(stats[1]),
        lastCheckIn: Number(stats[0])
      }
    })

    return formatted.sort((a, b) => b.streak - a.streak).slice(0, 10)
  }, [allAddresses, leaderboardRawData])

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  // Tampilan Skeleton saat Loading
  if (isLoadingList || isLoadingStats) {
    return (
        <div className="card">
            <h2 style={{ marginBottom: '16px', color: '#fff' }}>🏆 Star Leaderboard</h2>
            <div className="animate-pulse">
                {[1,2,3].map(i => (
                    <div key={i} style={{height: '40px', background: 'rgba(255,255,255,0.05)', marginBottom: '8px', borderRadius: '8px'}}></div>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div className="card">
        <h2 style={{ marginBottom: '16px', color: '#fff' }}>🏆 Star Leaderboard</h2>
        <div style={{ textAlign: 'left' }}>
          {leaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No data yet</div>
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
                    background: user.address === currentAddress ? 'rgba(251, 191, 36, 0.1)' : 'transparent' 
                  }}>
                    <td style={{ padding: '12px 10px', width: '50px' }}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </td>
                    <td style={{ padding: '12px 10px', color: user.address === currentAddress ? '#fbbf24' : '#e2e8f0' }}>
                      {shortenAddress(user.address)}
                      {user.address === currentAddress && <span style={{ marginLeft: '6px', fontSize: '10px', background: '#d97706', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>YOU</span>}
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
  )
}