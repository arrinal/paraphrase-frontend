import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import DiffView from './DiffView';

interface HistoryEntry {
    id: number;
    original_text: string;  // Match backend field names
    paraphrased_text: string;  // Match backend field names
    language: string;
    style: string;
    created_at: string;
}

interface ParaphraseHistoryProps {
    history: HistoryEntry[];
    onCopy: (text: string, type: 'original' | 'paraphrased') => Promise<void>;
    copiedText: 'original' | 'paraphrased' | null;
}

export default function ParaphraseHistory({ history, onCopy, copiedText }: ParaphraseHistoryProps) {
    const [showDiff, setShowDiff] = useState<number | null>(null);
    const [copiedItems, setCopiedItems] = useState<{ id: number; type: 'original' | 'paraphrased' }[]>([]);

    const formatDate = (dateString: string) => {
        try {
            return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
        } catch (error) {
            console.error('Invalid date:', dateString);
            return 'Invalid date';
        }
    };

    const handleCopy = async (id: number, text: string, type: 'original' | 'paraphrased') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedItems([...copiedItems, { id, type }]);
            setTimeout(() => {
                setCopiedItems(items => items.filter(item => !(item.id === id && item.type === type)));
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const isCopied = (id: number, type: 'original' | 'paraphrased') => {
        return copiedItems.some(item => item.id === id && item.type === type);
    };

    return (
        <div className="space-y-4">
            {history.map((entry) => (
                <div key={entry.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-gray-500">
                                {formatDate(entry.created_at)}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {entry.language} • {entry.style}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-medium text-gray-700">Original</h4>
                                    <button
                                        onClick={() => handleCopy(entry.id, entry.original_text, 'original')}
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                        title="Copy to clipboard"
                                    >
                                        {isCopied(entry.id, 'original') ? (
                                            <CheckIcon className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <ClipboardIcon className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-gray-600 text-sm whitespace-pre-wrap">
                                    {entry.original_text}
                                </p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-medium text-gray-700">Paraphrased</h4>
                                    <button
                                        onClick={() => handleCopy(entry.id, entry.paraphrased_text, 'paraphrased')}
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                        title="Copy to clipboard"
                                    >
                                        {isCopied(entry.id, 'paraphrased') ? (
                                            <CheckIcon className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <ClipboardIcon className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-gray-600 text-sm whitespace-pre-wrap">
                                    {entry.paraphrased_text}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowDiff(showDiff === entry.id ? null : entry.id)}
                            className="mt-4 text-sm text-primary-600 hover:text-primary-700"
                        >
                            {showDiff === entry.id ? 'Hide Comparison' : 'Show Comparison'}
                        </button>
                        {showDiff === entry.id && (
                            <div className="mt-4">
                                <DiffView
                                    original={entry.original_text}
                                    modified={entry.paraphrased_text}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
