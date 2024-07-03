import { useEffect } from 'react';
import { useDispatch } from 'react-redux'

import { 
loadProvider, 
loadNetwork, 
loadAccount, 
loadTokens, 
loadExchange
} from '../store/interactions'

import config from '../config.json'


function App() {

  const dispatch = useDispatch()

  const loadBlockchaindata = async () => {
    const provider = loadProvider(dispatch)
    const chainId = await loadNetwork(provider, dispatch)


    await loadAccount(provider, dispatch)
    

    const TonyToken = config[chainId].TonyToken.address
    const ElyseToken = config[chainId].ElyseToken.address
    const Exchange = config[chainId].exchange.address
    await loadTokens(provider, [TonyToken, ElyseToken] , dispatch)
    
    await loadExchange(provider, Exchange, dispatch)

  } 

  useEffect(() => {
    loadBlockchaindata()

  })
  return (
    <div>

      {/* Navbar */}

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;
