export const isIOS = () => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
};

export const isIOSApp = () => {
    return isIOS() && window.webkit?.messageHandlers?.purchaseHandler !== undefined;
}; 