import { useState, useEffect } from 'react';

const useFetchFunction = <T>() => {
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<undefined | unknown>();
  const [response, setResponse] = useState<Response | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [controller, setController] = useState<AbortController | undefined>();

  const fetchFunction = async(url: string, config: RequestInit | undefined = undefined) => {
    try {
      setIsLoading(true);
      setResponse(undefined);
      setData(undefined);
      setError(undefined);
      const controller = new AbortController();
      setController(controller);
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      setResponse(response);
      const data = await response.json();
      if(response.ok) {
        setData(data);
      }
      else {
        setError(data);
      }
    }
    catch(e) {

    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    return () => controller && controller.abort();
  }, [controller]);

  return { data, isLoading, error, response, fetchFunction, status: response?.status };
}

export default useFetchFunction;
