import * as React from "react";

export const capitalize = React.useCallback((name: string) => {
    const word = String(name);

    return word.charAt(0).toUpperCase() + word.slice(1);
}, []);