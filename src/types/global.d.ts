interface Window {
  webkit?: {
    messageHandlers?: {
      purchaseHandler?: {
        postMessage: (message: any) => void;
      };
      appBridge?: {
        postMessage: (message: any) => void;
      };
    };
  };
  handleIOSMessage?: (message: string) => void;
} 