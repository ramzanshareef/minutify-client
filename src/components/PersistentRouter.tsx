import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const PersistentRouter = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Restore state on initial load
    useEffect(() => {
        chrome.storage.local.get(['routerState'], (result) => {
            if (result.routerState?.pathname && result.routerState.pathname !== location.pathname) {
                navigate(result.routerState.pathname, { state: result.routerState.state });
            }
        });
    }, []);

    // Save state on route change
    useEffect(() => {
        chrome.storage.local.set({
            routerState: {
                pathname: location.pathname,
                state: location.state
            }
        });
    }, [location]);

    return <>{children}</>;
};