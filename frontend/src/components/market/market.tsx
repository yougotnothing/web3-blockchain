import { useState, useEffect } from 'react'
import './Market.css'
import { CurrencyChart } from './currencyChart/currencyChart'

interface Token {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency: number
  market_cap: number
  image: string
  sparkline_in_7d: {
    price: number[]
  }
}

const Market = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?' +
          `vs_currency=usd&order=market_cap_desc&per_page=6&page=${page}&sparkline=true&price_change_percentage=7d`
        )
        const data = await res.json()
        setTokens(data)
      } catch (e) {
        console.error('Fetch prices failed:', JSON.stringify(e, null, 2))
      } finally {
        setLoading(false)
      }
    }
    fetchPrices()
  }, [page])

  console.log('tokens: ', tokens)

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber)
  }

  if (loading) return <div className="market-loading">Loading...</div>

  return (
    <div className="market-container">
      <div className="market-header">
        <input
          type="text"
          placeholder="Search tokens..."
          className="market-search"
        />
      </div>
      <div className="market-grid">
        {tokens.map((token) => (
          <div key={token.id} className="market-card">
            <div>
              <div className="market-card-header">
                <img
                  src={token.image}
                  alt={`${token.name} logo`}
                  className="market-card-image"
                />
                <div className="market-card-title">
                  {token.name} <span>({token.symbol.toUpperCase()})</span>
                </div>
              </div>
              <div className="market-card-price">
                ${token.current_price.toLocaleString()}
              </div>
              <div
                className={`market-card-change ${
                  token.price_change_percentage_24h >= 0
                    ? 'positive'
                    : 'negative'
                }`}
              >
                {token.price_change_percentage_24h.toFixed(2)}%
              </div>
            </div>
            <div className="market-card-chart">
              <div className="market-card-chart_title">
                Last 7 Days
              </div>
            <CurrencyChart
              data={token.sparkline_in_7d.price}
              color={token.price_change_percentage_7d_in_currency < 0 ? '#ef4444' : '#10b981'}
            />
            </div>
          </div>
        ))}
      </div>
      <div className='market-pagination'>
        <button className='market-pagination-button' onClick={() => handlePageChange(1)}>
          1
        </button>
        <button className='market-pagination-button' onClick={() => handlePageChange(2)}>
          2
        </button>
        <button className='market-pagination-button' onClick={() => handlePageChange(3)}>
          3
        </button>
      </div>
    </div>
  )
}

export default Market