import { useEffect, useState } from 'react';

const useRootUrl = () => {
  const [rootUrl, setRootUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.protocol}//${window.location.host}`;
      setRootUrl(url);
    }
  }, []);

  return rootUrl;
};

export default useRootUrl;
