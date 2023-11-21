import { useCallback, useState } from "react";

export const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sendRequest = useCallback(async (body, headers = {}) => {
    setIsLoading(true);
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL, {
        method: "POST",
        body,
        headers: { ...headers, "Content-Type": "application/json" },
      });

      const responseData = await response.json();

      if (
        responseData.errors &&
        responseData.errors[0]?.status !== 200 &&
        responseData.errors[0]?.status !== 201
      ) {
        throw new Error(responseData.errors[0].message);
      }

      setIsLoading(false);
      return responseData;
    } catch (err) {
      setError(err.message || "Something was wrong, please try again.");
      setIsLoading(false);
      throw err;
    }
  }, []);

  return {
    sendRequest,
    setError,
    isLoading,
    error,
  };
};
