import { useEffect, useState, useRef } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import logo from '../assets/logo.svg'
import logo1 from '../assets/logo1.svg'
import logo2 from '../assets/logo2.svg'
import config from '../config.json'
import { 
loadBalances,
transferTokens
} from '../store/interactions'
import Banner from './Banner';

const Balance = () => {
  const [isDeposit, setIsDeposit] = useState(true)
  const [token1TransferAmount, setToken1TransferAmount] = useState(0)
  const [token2TransferAmount, setToken2TransferAmount] = useState(0)
  const dispatch = useDispatch()
  
  const provider = useSelector(state => state.provider.connection)  
  const account = useSelector(state => state.provider.account)
  const chainId = useSelector(state => state.provider.chainId)
  

  const exchange= useSelector(state => state.exchange.contract)
  const exchangeBalances= useSelector(state => state.exchange.balances)
  const transferInProgress= useSelector(state => state.exchange.transferInProgress)

  const tokens= useSelector(state => state.tokens.contracts)
  const symbols = useSelector(state => state.tokens.symbols)
  const tokenBalances= useSelector(state => state.tokens.balances)

  const depositRef = useRef(null)
  const withdrawRef = useRef(null)


  const tabHandler = (e) => {
    if(e.target.className !== depositRef.current.className) {
      e.target.className = "tab tab--active"
      depositRef.current.className = "tab"
      setIsDeposit(false)
    }else{
      e.target.className = "tab tab--active"
      withdrawRef.current.className = 'tab'
      setIsDeposit(true)
    }
    
  }
  const amountHandler = (e, token) => {
    if(token.address === tokens[0].address){
      setToken1TransferAmount(e.target.value)
    }
    if(token.address === tokens[1].address){
      setToken2TransferAmount(e.target.value)
    }
    
  }

  const depositHandler = (e, token) => {
    e.preventDefault()

    if(token.address === tokens[0].address){
      transferTokens(provider, exchange, 'Deposit', token, token1TransferAmount, dispatch)
      setToken1TransferAmount(0)
    }
    if(token.address === tokens[1].address){
      transferTokens(provider, exchange, 'Deposit', token, token2TransferAmount, dispatch)
      setToken2TransferAmount(0)
    }
    
  }
  const withdrawHandler = (e, token) => {
    e.preventDefault()

    if(token.address === tokens[0].address){
      transferTokens(provider, exchange, 'Withdraw', token, token1TransferAmount, dispatch)
      setToken1TransferAmount(0)
    }
    if(token.address === tokens[1].address){
      transferTokens(provider, exchange, 'Withdraw', token, token2TransferAmount, dispatch)
      setToken2TransferAmount(0)
    }
    
  }


  useEffect(() => {
    if(exchange && tokens[0] && tokens[1] && account){
    loadBalances(exchange, tokens, account, dispatch)
    }
  }, [dispatch, exchange, tokens, account, transferInProgress])
  return (account ? (
    <div className='component exchange__transfers'>
      <div className='component__header flex-between'>
        <h2>Balance</h2>
        <div className='tabs'>
          <button onClick={tabHandler} ref={depositRef}  className='tab tab--active'>Deposit</button>
          <button onClick={tabHandler} ref={withdrawRef} className='tab'>Withdraw</button>
        </div>
      </div>

      {/* Deposit/Withdraw Component 1 (DApp) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
          <p><small>Token</small><br /><img src={symbols && (
            symbols[0] === config[chainId].TonyToken.symbol
            ) ? (
              logo
            ) : (
              (
                symbols[0] === config[chainId].ElyseToken.symbol
              ) ? (
                logo1
              ) : (
                (
                  symbols[0] === config[chainId].IrisToken.symbol
                ) ? (
                  logo2
                ) : (
                  "#"
                )
              )
            )
        } alt="Token Logo" />{symbols && symbols[0]}</p>
        <p><small>Wallet</small><br />{tokenBalances && tokenBalances[0]}</p>
        <p><small>Exchange</small><br />{exchangeBalances && exchangeBalances[0]}</p>
        </div>

        <form onSubmit={isDeposit ? (e) => depositHandler(e, tokens[0]) : (e) => withdrawHandler(e, tokens[0]) }>
          <label htmlFor="token0">{symbols && symbols[0]} Amount</label>
          <input 
          type="text" 
          id='token0' 
          placeholder='0.0000' 
          value={token1TransferAmount === 0 ? "" : token1TransferAmount}
          onChange={(e) => amountHandler(e, tokens[0])}/>

          <button className='button' type='submit'>
          { isDeposit ? (
            <span>Deposit</span>
          ) : (
            <span>Withdraw</span>
          )}
          </button>
        </form>
      </div>

      <hr />

      {/* Deposit/Withdraw Component 2 (mETH) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
                <p><small>Token</small><br /><img src={(
            symbols[1] === config[chainId].TonyToken.symbol
            ) ? (
              logo
            ) : (
              (
                symbols[1] === config[chainId].ElyseToken.symbol
              ) ? (
                logo1
              ) : (
                (
                  symbols[1] === config[chainId].IrisToken.symbol
                ) ? (
                  logo2
                ) : (
                  "#"
                )
              )
            )
        } alt="Token Logo" />{symbols && symbols[1]}</p>
        <p><small>Wallet</small><br />{tokenBalances && tokenBalances[1]}</p>
        <p><small>Exchange</small><br />{exchangeBalances && exchangeBalances[1]}</p>
        </div>

        <form onSubmit={ isDeposit ? (e) => depositHandler(e, tokens[1]) : (e) => withdrawHandler(e, tokens[1]) }>
          <label htmlFor="token0">{symbols && symbols[1]} Amount</label>
          <input 
          type="text" 
          id='token1' 
          placeholder='0.0000' 
          value={token2TransferAmount === 0 ? "" : token2TransferAmount}
          onChange={(e) => amountHandler(e, tokens[1])}/>

          <button className='button' type='submit'>
            { isDeposit ? (
              <span>Deposit</span>
            ) : (
              <span>Withdraw</span>
            )}
          </button>
        </form>
      </div>

      <hr />
    </div>
    ) : (<div className='component exchange__transfers'>
      



      <div className='exchange__transfers--form'>
        <div className='flex-between'>

        </div>

        <p><Banner text={"Please connect with Metamask"} /></p>
      </div>

      

      


    </div>
      
    )
  );
}

export default Balance;