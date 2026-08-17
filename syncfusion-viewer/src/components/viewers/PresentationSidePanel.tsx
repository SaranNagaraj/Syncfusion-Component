import React from "react";
import { useState } from 'react';
import "./Presentation.css"

interface Props {
    pdfViewerRef: React.RefObject<any>;
    searchWord: string;
    searchResults: any[];
}

export default function PresentationSidePanel({
    pdfViewerRef,
    searchWord,
    searchResults
}: Props) {
    const [addedAnnotationIds, setAddedAnnotationIds] = useState([]);
    const [selectedOccurrence, setSelectedOccurrence] = useState('');

    const handleOccurrenceChange = (event: any) => {
        const value = event.target.value;
        setSelectedOccurrence(value);
        const selected:any = searchResults.find((x: any) => x.id === value);
        if (!selected) return;
        const viewer = pdfViewerRef.current;
        if (!viewer) return;
        pdfViewerRef.current.navigation.goToPage(selected.page);
    };

    return (
        <div >
                {/* Right Panel - Command Panel */}
                <div className='command-panel'>
                    {/* Header - Search Input and Button */}
                    <div className='command-header'>
                        Speaker Notes
                    </div>

                    {/* Content Area - Results/Highlights */}
                    <div className='command-content'>
                        {searchResults.length > 0 && (
                            <>
                                <div className='results-count'>{searchWord}</div>
                                <div className='results-list'>
                                    {searchResults.map((result) => (
                                        <div
                                            key={result.id}
                                            className={`result-item ${selectedOccurrence === result.id ? 'selected' : ''}`}
                                            onClick={() => handleOccurrenceChange({ target: { value: result.id } })}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className='result-page'>
                                                Slide {result.slideNo}
                                            </div>
                                            <div className='result-occurrence'>
                                                {result.note}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {searchResults.length === 0 && (
                            <div className='no-results'>
                                <p>No speaker notes found.</p>
                            </div>
                        )}
                    </div>
                </div>


            </div>
    );
}