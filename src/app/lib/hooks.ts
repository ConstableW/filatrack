import { useCallback, useState } from "react";

export function useObjectState<T extends object>(initial: T) {
    const [state, setState] = useState(initial);

    const update = useCallback((patch: Partial<T>) => {
        setState(prev => ({ ...prev, ...patch }));
    }, []);

    return [state, update] as const;
}
