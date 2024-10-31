import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { paraphraseText } from '../utils/api';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useActivity } from '../hooks/useActivity';

const MAX_CHARS = 1000;

interface ParaphraseHistory {
    originalText: string;
    paraphrasedText: string;
    language: string;
    style: string;
    timestamp: Date;
}

// Add onParaphraseComplete prop
interface ParaphraseFormProps {
    onParaphraseComplete?: () => void;
}

export default function ParaphraseForm({ onParaphraseComplete }: ParaphraseFormProps) {
    const [text, setText] = useState('');
    const [language, setLanguage] = useState('auto');  // Changed default to 'auto'
    const [style, setStyle] = useState('standard');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<ParaphraseHistory[]>([]);
    const { user } = useAuth();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [copiedText, setCopiedText] = useState<'original' | 'paraphrased' | null>(null);
    const { trackActivity } = useActivity();

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        if (newText.length <= MAX_CHARS) {
            setText(newText);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        setIsLoading(true);
        try {
            const result = await paraphraseText(text, language, style);
            setResult(result);
            
            // Track paraphrase activity
            await trackActivity('paraphrase', {
                textLength: text.length,
                language,
                style,
                timestamp: new Date().toISOString()
            } as Record<string, any>);
            
            if (onParaphraseComplete) {
                onParaphraseComplete();
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to paraphrase text');
            // Track error
            await trackActivity('paraphrase_error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            } as Record<string, any>);
        } finally {
            setIsLoading(false);
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

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                        Text to Paraphrase
                    </label>
                    <div className="mt-1 relative">
                        <textarea
                            ref={textareaRef}
                            id="text"
                            value={text}
                            onChange={handleTextChange}
                            className="mt-1 block w-full border-2 border-gray-200 rounded-lg shadow-sm 
                            focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                            hover:border-gray-300 transition-colors duration-200
                            min-h-[100px] pb-8 px-3 py-2"
                            style={{ resize: 'none' }}
                            placeholder="Enter your text here..."
                            required
                        />
                        <div className="absolute bottom-2 left-3 text-sm text-gray-500 bg-white px-1">
                            {text.length}/{MAX_CHARS} characters
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                            Language
                        </label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="auto">Auto-Detect</option>
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Italian">Italian</option>
                            <option value="Portuguese">Portuguese</option>
                            <option value="Russian">Russian</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Korean">Korean</option>
                            <option value="Chinese">Chinese</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="style" className="block text-sm font-medium text-gray-700">
                            Style
                        </label>
                        <select
                            id="style"
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="standard">Standard</option>
                            <option value="formal">Formal</option>
                            <option value="casual">Casual</option>
                            <option value="creative">Creative</option>
                            <option value="professional">Professional</option>
                            <option value="academic">Academic</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || !text.trim()}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isLoading || !text.trim() ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner size="small" />
                            <span className="ml-2">Paraphrasing...</span>
                        </>
                    ) : (
                        'Paraphrase'
                    )}
                </button>
            </form>

            {result && (
                <div className="mt-6 space-y-4">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-medium text-gray-900">Original Text</h3>
                                <button
                                    onClick={() => handleCopy(text, 'original')}
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
                            <p className="text-gray-700 whitespace-pre-wrap">{text}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-medium text-gray-900">Paraphrased Text</h3>
                                <button
                                    onClick={() => handleCopy(result, 'paraphrased')}
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
                            <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
                        </div>
                    </div>
                </div>
            )}

            {history.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">History</h3>
                    <div className="space-y-4">
                        {history.map((entry, index) => (
                            <div key={index} className="p-4 bg-white rounded-lg shadow">
                                <div className="flex justify-between text-sm text-gray-500 mb-2">
                                    <span>{entry.language}  {entry.style}</span>
                                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">Original</h4>
                                        <p className="text-gray-600">{entry.originalText}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">Paraphrased</h4>
                                        <p className="text-gray-600">{entry.paraphrasedText}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
