import { useSelector } from 'react-redux';

import Chart from 'react-apexcharts';
import { options, defaultSeries } from './PriceChart.config';
import Banner from './Banner';
import downarrow from '../assets/downarrow.svg';
import uparrow from '../assets/uparrow.svg';
import { priceChartSelector } from '../store/selectors';

const PriceChart = () => {
  const account = useSelector(state => state.provider.account)
  const symbols = useSelector(state => state.tokens.symbols)
  const priceChart = useSelector(priceChartSelector)
  return (
    <div className="component exchange__chart">
      <div className='component__header flex-between'>
        <div className='flex'>

          <h2>{symbols && `${symbols[0]}/${symbols[1]}`}</h2>

          <div className='flex'>
            {priceChart && priceChart.lastPriceChange === '+' ? (
              <img src={uparrow} alt="Arrow down" />
            ) : (
              <img src={downarrow} alt="Arrow down" />
            )}
            

            
            <span className='up'>{priceChart ? priceChart.lastPrice : ("")}</span>
          </div>

        </div>
      </div>

      {/* Price chart goes here */}
      {!account ? (
        <p><Banner text={"Please connect with Metamask"} /></p>
      ) : (
        <Chart 
        type='candlestick'
        options={options}
        series={priceChart ? priceChart.series : defaultSeries}
        width="100%"
        height="100%"
        />
      )}
    </div>
  );
}

export default PriceChart;