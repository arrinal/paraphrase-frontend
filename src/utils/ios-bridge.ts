export const isIOSApp = () => {
    if (typeof window === 'undefined') return false;
    return !!window.webkit?.messageHandlers?.appBridge;
};

export const sendToIOS = (type: string, data: any) => {
    if (!isIOSApp()) return;
    
    window.webkit?.messageHandlers?.appBridge?.postMessage({
        type,
        data
    });
};

// Handle messages from iOS
export const setupIOSBridge = () => {
    window.handleIOSMessage = (message: string) => {
        try {
            const data = JSON.parse(message);
            handleIOSEvent(data);
        } catch (error) {
            console.error('Failed to parse iOS message:', error);
        }
    };
};

const handleIOSEvent = (event: { type: string; data: any }) => {
    switch (event.type) {
        case 'purchaseCompleted':
            // Handle successful purchase
            break;
        case 'purchaseFailed':
            // Handle failed purchase
            break;
        case 'userAuthenticated':
            // Handle user authentication
            break;
        // Add more event handlers as needed
    }
}; 