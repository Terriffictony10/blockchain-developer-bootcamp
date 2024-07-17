import { useEffect } from 'react';
import { useDispatch } from 'react-redux'

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
import PriceChart from './PriceChart'
import OrderBook from './OrderBook'
import Orders from './Orders'
import Balance from './Balance'
import Markets from './Markets'
import Navbar from './Navbar'
import config from '../config.json'


function App() {

  const dispatch = useDispatch()

  const loadBlockchaindata = async () => {
    const provider = await loadProvider(dispatch)
    const chainId = await loadNetwork(provider, dispatch)

    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })
    window.ethereum.on('accountsChanged', () => {
      loadAccount(provider, dispatch)
    })
    

    const TonyToken = config[chainId].TonyToken.address
    const ElyseToken = config[chainId].ElyseToken.address
    const Exchange = config[chainId].exchange.address
    await loadTokens(provider, [TonyToken, ElyseToken] , dispatch)
    
    const exchange = await loadExchange(provider, Exchange, dispatch)

    loadAllOrders(provider, exchange, dispatch)

    subscribeToEvents(exchange, dispatch)
  } 

  useEffect(() => {
    loadBlockchaindata()

  })
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

          {/* Transactions */}

          <Trades />

          <OrderBook />
          
        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;