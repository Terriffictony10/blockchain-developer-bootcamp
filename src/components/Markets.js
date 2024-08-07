import { useSelector, useDispatch } from 'react-redux'

import config from '../config.json'

import { loadTokens } from '../store/interactions'

const Markets = () => {
  const provider = useSelector(state => state.provider.connection)
  const chainId = useSelector(state => state.provider.chainId)

  const dispatch = useDispatch()

  const marketHandler = async (e) => {
    loadTokens(provider, (e.target.value).split(','), dispatch)
  }

  return(
    <div className='component exchange__markets'>
      <div className='component__header'>
        <h2>Select Market</h2>
      </div>

      {chainId && config[chainId] ? (
        <select name="markets" id="markets" onChange={marketHandler}>
          <option value={`${config[chainId].TonyToken.address},${config[chainId].ElyseToken.address}`}>TTK / EEK</option>
          <option value={`${config[chainId].TonyToken.address},${config[chainId].IrisToken.address}`}>TTK / IRIS</option>
          <option value={`${config[chainId].ElyseToken.address},${config[chainId].TonyToken.address}`}>EEK / TTK</option>
          <option value={`${config[chainId].ElyseToken.address},${config[chainId].IrisToken.address}`}>EEK / IRIS</option>
          <option value={`${config[chainId].IrisToken.address},${config[chainId].TonyToken.address}`}>IRIS / TTK</option>
          <option value={`${config[chainId].IrisToken.address},${config[chainId].ElyseToken.address}`}>IRIS / EEK</option>
        </select>
      ) : (
        <div>
          <p>Not Deployed to Network</p>
        </div>
      )}

      <hr />
    </div>
  )
}

export default Markets;
