import { useEffect, useState } from "react";



const PREFIX = 'LOCAL-TOAST-';

/**
 * creates an entry in localStorage and returns the data at that entry if present. It returns a function to set 
 * the value at that entry
 * @param key the key where data will be set in localstorage
 * @param intialValue the value to be initally set in localstroge if no data currently exsits
 * @returns a useState value and set function
 */
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
    const prefixedKey = PREFIX + key;

    const [value, setValue] = useState<T>(() => {
        const storedItem = localStorage.getItem(prefixedKey);
        if (storedItem !== null) {
            return JSON.parse(storedItem);
        }

        if (typeof initialValue === 'function') {
            return (initialValue as () => T)();
        } else {
            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(prefixedKey, JSON.stringify(value));
        console.log(value)
    }, [prefixedKey, value]);


    return [value, setValue];
}


