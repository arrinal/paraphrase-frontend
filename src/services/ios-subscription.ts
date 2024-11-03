import { API_BASE_URL } from '@/utils/constants';

export async function verifyIOSReceipt(receipt: {
    transaction_id: string;
    product_id: string;
    receipt_data: string;
}) {
    const response = await fetch(`${API_BASE_URL}/api/ios/verify-receipt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(receipt),
    });

    if (!response.ok) {
        throw new Error('Failed to verify receipt');
    }

    return response.json();
} 