import { useCallback, useState } from "react";

export const useLocalStorage = <T,>(initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);

  const updateValue = useCallback((key: string, newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  }, []);

  const getValue = useCallback(
    (key: string) => {
      const storedValue = localStorage.getItem(key);
      const initial = storedValue ? JSON.parse(storedValue) : initialValue;
      setValue(initial);
    },
    [initialValue]
  );

  return { value, updateValue, getValue };
};
