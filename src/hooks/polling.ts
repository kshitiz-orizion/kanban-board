import { useEffect, useRef } from 'react';
// import { useIssueContext } from '../components/IssueContext';

export const usePolling = (
  callback: () => void | Promise<void>,
  interval: number
) => {
  const savedCallback = useRef(callback);
  // const {setLastUpdated} = useIssueContext();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (interval <= 0) return;

    const tick = () => {
      savedCallback.current()
      // setLastUpdated(Date.now().toString())
    };

    const id = setInterval(tick, interval);

    return () => clearInterval(id);
  }, [interval]);
};
