import { useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux'

import { 
  loadProvider, 
  loadNetwork, 
  loadAccount, 
  loadTokens, 
  loadExchange,
  subscribeToEvents, 
  loadAllOrders
} from '../store/interactions'
import Trades from './Trades'
import Alert from './Alert'
import PriceChart from './PriceChart'
import OrderBook from './OrderBook'
import Orders from './Orders'
import Balance from './Balance'
import Markets from './Markets'
import Navbar from './Navbar'
import Transactions from './MyTransactions'
import config from '../config.json'

function App() {
  const dispatch = useDispatch()
  const account = useSelector(state => state.provider.account)

  // Function to load all blockchain data
  const loadBlockchaindata = async () => {
    // Load provider and network
    const provider = await loadProvider(dispatch)
    const chainId = await loadNetwork(provider, dispatch)

    // Reload page on network change
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    // Reload account data on account change
    window.ethereum.on('accountsChanged', () => {
      loadAccount(provider, dispatch)
    })

    // Load token addresses from config
    const TonyToken = config[chainId].TonyToken.address
    const ElyseToken = config[chainId].ElyseToken.address
    const Exchange = config[chainId].exchange.address

    // Load tokens and exchange
    await loadTokens(provider, [TonyToken, ElyseToken], dispatch)
    const exchange = await loadExchange(provider, Exchange, dispatch)

    // Load all orders and subscribe to events
    loadAllOrders(provider, exchange, dispatch)
    subscribeToEvents(exchange, dispatch)
  }

  // Use effect to load blockchain data on component mount
  useEffect(() => {
    loadBlockchaindata()
  }, [])

  return (
    <div>
      <Navbar />

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>
          <Markets />
          <Balance />
          <Orders />
        </section>
        <section className='exchange__section--right grid'>
          <PriceChart />
          <Transactions />
          <Trades />
          <OrderBook />
        </section>
      </main>

      <Alert />
    </div>
  );
}

export default App;
