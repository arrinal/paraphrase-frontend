interface Window {
  webkit?: {
    messageHandlers?: {
      purchaseHandler?: {
        postMessage: (message: any) => void;
      };
    };
  };
} 