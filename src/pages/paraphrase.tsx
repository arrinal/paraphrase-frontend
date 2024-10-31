import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import ParaphraseForm from '../components/ParaphraseForm';
import ParaphraseHistory from '../components/ParaphraseHistory';
import LoadingSpinner from '../components/LoadingSpinner';
import { getParaphraseHistory, getUsedLanguages } from '../utils/api';

interface HistoryFilters {
    language?: string;
    style?: string;
    startDate?: Date;
    endDate?: Date;
}

interface HistoryEntry {
    id: number;
    original_text: string;
    paraphrased_text: string;
    language: string;
    style: string;
    created_at: string;
}

export default function ParaphrasePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [filters, setFilters] = useState<HistoryFilters>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [copiedText, setCopiedText] = useState<'original' | 'paraphrased' | null>(null);
    const itemsPerPage = 5;
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (user) {
            loadHistory();
        }
    }, [user, currentPage, filters]);

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const languages = await getUsedLanguages();
                setAvailableLanguages(languages);
            } catch (error) {
                console.error('Failed to fetch languages:', error);
            }
        };

        if (user) {
            fetchLanguages();
        }
    }, [user]);

    const loadHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const [historyData, languages] = await Promise.all([
                getParaphraseHistory(),
                getUsedLanguages()
            ]);
            
            // Apply filters
            let filteredData = historyData;
            if (filters.language) {
                filteredData = filteredData.filter(item => item.language === filters.language);
            }
            if (filters.style) {
                filteredData = filteredData.filter(item => item.style === filters.style);
            }
            if (filters.startDate) {
                filteredData = filteredData.filter(item => new Date(item.created_at) >= filters.startDate!);
            }
            if (filters.endDate) {
                filteredData = filteredData.filter(item => new Date(item.created_at) <= filters.endDate!);
            }
            
            setHistory(filteredData);
            setAvailableLanguages(languages);
        } catch (error) {
            console.error('Failed to load history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleCopy = async (text: string, type: 'original' | 'paraphrased') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(type);
            setTimeout(() => setCopiedText(null), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const handleFilterChange = (newFilters: Partial<HistoryFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const paginatedHistory = history.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(history.length / itemsPerPage);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Paraphrase Text</h1>
                <ParaphraseForm onParaphraseComplete={loadHistory} />

                {/* History Section */}
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">History</h2>
                        
                        {/* Filters */}
                        <div className="flex space-x-4">
                            <select
                                onChange={(e) => handleFilterChange({ language: e.target.value || undefined })}
                                className="border rounded-md px-2 py-1"
                            >
                                <option value="">All Languages</option>
                                {availableLanguages.map((lang) => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>

                            <select
                                onChange={(e) => handleFilterChange({ style: e.target.value || undefined })}
                                className="border rounded-md px-2 py-1"
                            >
                                <option value="">All Styles</option>
                                <option value="standard">Standard</option>
                                <option value="formal">Formal</option>
                                <option value="casual">Casual</option>
                                {/* Add more style options */}
                            </select>

                            <input
                                type="date"
                                onChange={(e) => handleFilterChange({ 
                                    startDate: e.target.value ? new Date(e.target.value) : undefined 
                                })}
                                className="border rounded-md px-2 py-1"
                            />
                        </div>
                    </div>

                    {isLoadingHistory ? (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner size="medium" />
                        </div>
                    ) : (
                        <>
                            <ParaphraseHistory 
                                history={paginatedHistory} 
                                onCopy={handleCopy}
                                copiedText={copiedText}
                            />
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-6 space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
