import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Update debounced value after delay
    const handleer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handleer);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debouncedValue;
};

export default useDebounce;
