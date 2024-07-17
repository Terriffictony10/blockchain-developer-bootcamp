import { useSelector } from 'react-redux';
import { filledOrdersSelector } from '../store/selectors';
const Trades = () => {
  const filledOrders = useSelector(filledOrdersSelector)
  return (
    <div className="component exchange__trades">
      <div className='component__header flex-between'>
        <h2>Trades</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>

        {filledOrders && filledOrders.map((order, index) => {
          return(
            <tr key={index}>
              <td>{order.formattedTimestamp}</td>
              <td style={{color: `${order.tokenPriceClass}`}}>{order.token0Amount}</td>
              <td>{order.tokenPrice}</td>
            </tr>
          )
        })}
          
        </tbody>
      </table>

    </div>
  );
}

export default Trades;