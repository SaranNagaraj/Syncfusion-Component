import React from "react";
import { useState } from 'react';
import "./Presentation.css"

interface Props {
    pdfViewerRef: React.RefObject<any>;
    searchWord: string;
    searchResults: any[];
    onViewNotesChange?: (isChecked: boolean) => void;
}

export default function PresentationSidePanel({
    pdfViewerRef,
    searchWord,
    searchResults,
    onViewNotesChange
}: Props) {
    const [selectedOccurrence, setSelectedOccurrence] = useState('');
    const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
    const [viewNotesChecked, setViewNotesChecked] = useState(false);

    const handleOccurrenceChange = (resultId: string) => {
        // If clicking on an already selected note, toggle expansion
        if (selectedOccurrence === resultId) {
            setExpandedNoteId(expandedNoteId === resultId ? null : resultId);
        } else {
            // If clicking on a different note, select it and expand it
            setSelectedOccurrence(resultId);
            setExpandedNoteId(resultId);
        }

        const selected:any = searchResults.find((x: any) => x.id === resultId);
        if (!selected) return;
        const viewer = pdfViewerRef.current;
        if (!viewer) return;
        pdfViewerRef.current.navigation.goToPage(selected.page);
    };

    const handleViewNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setViewNotesChecked(isChecked);
        setExpandedNoteId(null);
        setSelectedOccurrence('');
        // Notify parent component of the change
        if (onViewNotesChange) {
            onViewNotesChange(isChecked);
        }
    };

    const handleNextHighlight = () => {
        if (searchResults.length === 0) return;

        let nextIndex = 0;
        if (selectedOccurrence) {
            const currentIndex = searchResults.findIndex((x: any) => x.id === selectedOccurrence);
            nextIndex = (currentIndex + 1) % searchResults.length;
        }

        const nextResult = searchResults[nextIndex];
        handleOccurrenceChange(nextResult.id);
    };

    return (
        <div >
                {/* Right Panel - Command Panel */}
                <div className='command-panel'>
                    {/* Header - Search Input and Button */}
                    <div className='command-header'>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Speaker Notes</span>
                            <label className='checkbox-label'>
                                <input
                                    type='checkbox'
                                    checked={viewNotesChecked}
                                    onChange={handleViewNotesChange}
                                    className='checkbox-input'
                                />
                                <span className='checkbox-text'>View Notes</span>
                            </label>
                        </div>
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
                                            onClick={() => handleOccurrenceChange(result.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className='result-page'>
                                                Slide {result.slideNo}
                                            </div>
                                            <div 
                                                className={`result-occurrence ${expandedNoteId === result.id ? 'expanded' : ''}`}
                                            >
                                                {result.note}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div 
                                    onClick={handleNextHighlight}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: '16px',
                                        paddingTop: '12px',
                                        borderTop: '1px solid #e0e0e0',
                                        padding: '12px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        backgroundColor: '#ffffff',
                                        transition: 'all 0.2s',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        color: '#333'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                                        e.currentTarget.style.borderColor = '#d0d0d0';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#ffffff';
                                        e.currentTarget.style.borderColor = '#e0e0e0';
                                    }}
                                >
                                    <span>Next highlight</span>
                                    <span className='e-icons e-arrow-right' style={{ fontSize: '16px', color: '#1f73e6' }}></span>
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