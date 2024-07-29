import { useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import { myEventsSelector } from '../store/selectors';
import config from '../config.json';

const Alert = () => {
  // Create a reference for the alert element
  const alertRef = useRef(null);

  // Get state variables from Redux store
  const provider = useSelector(state => state.provider);
  const network = useSelector(state => state.provider.chainId);
  const account = useSelector(state => state.provider.account);
  const isPending = useSelector(state => state.exchange.transaction.isPending);
  const isError = useSelector(state => state.exchange.transaction.isError);
  const events = useSelector(myEventsSelector);

  // Handler to remove the alert
  const removeHandler = async (e) => {
    alertRef.current.className = 'alert--remove';
  };

  // Effect to show alert based on transaction status
  useEffect(() => {
    if ((isPending || isError) && account) {
      alertRef.current.className = 'alert';
    }
  }, [isPending, isError, account]);

  if (account) {
    return (
      <div>
        {isPending ? (
          <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}>
            <h1>Transaction Pending...</h1>
          </div>
        ) : isError ? (
          <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}>
            <h1>Transaction will fail</h1>
          </div>
        ) : !isPending ? (
          <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}>
            <h1>Transaction Successful</h1>
            <a
              href={config[network] ? `${config[network].explorerURL}/tx/${events[0].transactionHash}` : '#'}
              target='_blank'
              rel='noreferrer'
            >
              {events[0].transactionHash.slice(0, 6) + '...' + events[0].transactionHash.slice(60, 66)}
            </a>
          </div>
        ) : (
          <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div></div>
    );
  }
};

export default Alert;
