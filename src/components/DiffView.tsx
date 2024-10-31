import React from 'react';
import { diffWords } from 'diff';

interface DiffViewProps {
    original: string;
    modified: string;
}

export default function DiffView({ original = '', modified = '' }: DiffViewProps) {
    if (!original || !modified) {
        return <div>No text to compare</div>;
    }

    const diff = diffWords(original, modified);

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Original</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                    {diff.map((part, index) => (
                        <span
                            key={index}
                            className={
                                part.removed ? 'bg-red-100 line-through' :
                                !part.added ? '' : 'hidden'
                            }
                        >
                            {part.value}
                        </span>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Modified</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                    {diff.map((part, index) => (
                        <span
                            key={index}
                            className={
                                part.added ? 'bg-green-100' :
                                !part.removed ? '' : 'hidden'
                            }
                        >
                            {part.value}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
