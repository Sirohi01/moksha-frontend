// Razorpay integration utility
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number, currency = 'INR') => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment order');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const initiatePayment = async (options: RazorpayOptions) => {
  const isLoaded = await loadRazorpayScript();
  
  if (!isLoaded) {
    throw new Error('Failed to load Razorpay SDK');
  }

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};