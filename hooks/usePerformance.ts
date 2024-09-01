import * as React from 'react';
import { throttle, debounce } from "lodash";

export const onThrottle = (callback: () => Promise<void>) => {
    const ref = React.useRef<() => Promise<void>>();

    React.useEffect(() => {
        ref.current = callback;
    }, [callback]);

    const throttleCallback = React.useMemo(() => {
        const func = () => {
            ref.current?.();
        };

        return throttle(func, 2000);
    }, []);

    return throttleCallback;
};

export const onDebounce = (callback: () => Promise<void>) => {
    const ref = React.useRef<() => Promise<void>>();

    React.useEffect(() => {
        ref.current = callback;
    }, [callback]);

    const debounceCallback = React.useMemo(() => {
        const func = () => {
            ref.current?.();
        };

        return debounce(func, 500);
    }, []);

    return debounceCallback;
};