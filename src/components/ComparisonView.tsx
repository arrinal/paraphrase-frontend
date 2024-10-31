import React from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ComparisonViewProps {
    originalText: string;
    paraphrasedText: string;
    onCopy: (text: string, type: 'original' | 'paraphrased') => Promise<void>;
    copiedText: 'original' | 'paraphrased' | null;
}

export default function ComparisonView({ 
    originalText, 
    paraphrasedText, 
    onCopy,
    copiedText 
}: ComparisonViewProps) {
    return (
        <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900">Original Text</h3>
                        <button
                            onClick={() => onCopy(originalText, 'original')}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            title="Copy to clipboard"
                        >
                            {copiedText === 'original' ? (
                                <CheckIcon className="h-5 w-5 text-green-500" />
                            ) : (
                                <ClipboardIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{originalText}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900">Paraphrased Text</h3>
                        <button
                            onClick={() => onCopy(paraphrasedText, 'paraphrased')}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            title="Copy to clipboard"
                        >
                            {copiedText === 'paraphrased' ? (
                                <CheckIcon className="h-5 w-5 text-green-500" />
                            ) : (
                                <ClipboardIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{paraphrasedText}</p>
                </div>
            </div>
        </div>
    );
}
