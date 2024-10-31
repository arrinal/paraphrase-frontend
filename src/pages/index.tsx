import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    const handleGetStarted = () => {
        if (user) {
            router.push('/paraphrase');
        } else {
            // Open auth modal (you'll need to lift this state up or use a global state management)
            // For now, just redirect to paraphrase page, the ProtectedRoute will handle the auth
            router.push('/paraphrase');
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        AI Paraphrasing Tool
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Transform your text with advanced AI technology
                    </p>
                    <button
                        onClick={handleGetStarted}
                        className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </Layout>
    );
}
