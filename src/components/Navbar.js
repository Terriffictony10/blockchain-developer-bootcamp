import { useSelector } from 'react-redux'
import logo from '../assets/logo.png'
import eth from '../assets/eth.svg'
import Blockies from 'react-blockies'
import { 
loadAccount,
loadProvider,
loadNetwork
} from '../store/interactions'

import { useEffect } from 'react';

import { useDispatch } from 'react-redux'
import config from '../config.json'

const Navbar = () => {
  const provider = useSelector(state => state.provider.connection)
  const chainId = useSelector(state => state.provider.chainId) 
  const account = useSelector(state => state.provider.account)
  const balance = useSelector(state => state.provider.balance) 
  const dispatch = useDispatch()



  const connectHandler = async () => {
    await loadAccount(provider, dispatch)
  }
  const networkHandler = async (event) => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: event.target.value}]
    })
  }
 
  return(
    <div className='exchange__header grid'>
      <div className='exchange__header--brand flex'>
        <img src = {logo} className = "logo" alt = "Dapp Logo"></img>
        <h1>TonyToken Exchange</h1>
      </div>

      <div className='exchange__header--networks flex'>
          <img src = {eth} className = "Eth logo" alt = "Eth logo"></img>

              <select name="networks" id="networks" value={chainId ? `0x${chainId.toString(16)}` : '0'} onChange={networkHandler}>
              <option value="0" disabled>Select Network</option>
              <option value="0x7A69" >Localhost</option>
              <option value="0xaa36a7" >Sepolia</option>
            </select> 
        

          
      </div>

      <div className='exchange__header--account flex'>
        {balance ? (
          <p><small>My Balance</small>{Number(balance).toFixed(4)}</p>
        ) : (
          <p><small>My Balance</small> 0 ETH</p> 
        )}
        {account ? (
          <a 
          href="https://www.youtube.com/"
          target='_blank'
          rel='noreferrer'> 
          {account.slice(0,5) + "..." + account.slice(38,42)}
          <Blockies 
            seed = {account}
            className = "identicon"/>
          </a>
        ) : (
          <button className="button" onClick={connectHandler}>Connect</button>
        )}
      </div>
    </div>
  )
}

export default Navbar;