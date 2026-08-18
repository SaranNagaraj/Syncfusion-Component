import React from "react";
import { useState, useEffect } from 'react';
import "./PdfViewer.css"

interface Props {
    pdfViewerRef: React.RefObject<any>;
}

// 3 default search terms with custom titles
const DEFAULT_SEARCH_TERMS = [
    {
        title: 'Cross-Reference Table',
        searchTerm: 'After the header and the body comes the cross-reference table. It records the byte location of each object in the body of the file. This enables random-access of the document, so when rendering a page, only the objects required for that page are read from the file'
    },
    {
        title: 'Positioning Operators',
        searchTerm: 'Positioning operators determine where new text will be inserted. Remember, PDFs are a rather low-level method for representing documents. It\'s not possible to define the width of a paragraph and have the PDF document fill it in until it runs out of text. As we saw earlier, PDFs can\'t even line-wrap on their own'
    },
    {
        title: 'iTextSharp Text Objects',
        searchTerm: 'As we\'ve seen, iTextSharp works on a higher level than PDF text objects. It uses three levels of text objects: chunks, phrases, and paragraphs. These core text objects, along with most of the other available elements, reside in the iTextSharp.text namespace.'
    }
];

export default function PdfViewerSidePanel({
    pdfViewerRef
}: Props) {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedOccurrence, setSelectedOccurrence] = useState('');
    const [isLoaded] = useState(false);

    const px = (pt: number) => (pt * 96) / 72;

    const handleAutoSearch = async () => {
        const viewer = pdfViewerRef.current;
        if (!viewer) return;

        try {
            const allResults: any = [];
            const allAnnotationIds: any = [];
            let globalOccurrenceIndex = 1;

            // Search for each of the 3 terms
            for (const item of DEFAULT_SEARCH_TERMS) {
                const results = await viewer.textSearch.findTextAsync(item.searchTerm, false);
                
                if (!results || results.length === 0) continue;

                for (const pageResult of results) {
                    if (!pageResult?.bounds?.length) continue;
                    
                    const pageNumber = (pageResult.pageIndex ?? -1) + 1;
                    if (pageNumber < 1) continue;

                    const bounds = [];
                    for (const bound of pageResult.bounds) {
                        bounds.push({
                            x: px(bound.x),
                            y: px(bound.y),
                            width: px(bound.width),
                            height: px(bound.height)
                        });
                    }

                    const highlightId = `Highlight_${pageNumber}_${globalOccurrenceIndex}`;
                    
                    viewer.annotation.addAnnotation('Highlight', {
                        bounds: bounds,
                        pageNumber: pageNumber,
                        customData: {
                            searchId: highlightId
                        }
                    });

                    allAnnotationIds.push({ pageNumber, annotationId: highlightId });
                    allResults.push({
                        page: pageNumber,
                        title: item.title,
                        searchTerm: item.searchTerm,
                        id: highlightId,
                        occurrenceIndex: globalOccurrenceIndex
                    });

                    globalOccurrenceIndex++;
                }
            }

            setSearchResults(allResults);
        } catch (error) {
            console.error('Auto search error:', error);
            setSearchResults([]);
        }
    };

    // Auto-trigger search when PDF loads
    useEffect(() => {
        const viewer = pdfViewerRef.current;
        viewer.documentLoad = () => {
            handleAutoSearch()
        }
    }, [pdfViewerRef, isLoaded]);

    const handleOccurrenceChange = (event: any) => {
        const value = event.target.value;
        setSelectedOccurrence(value);

        const selected: any = searchResults.find((x: any) => x.id === value);
        if (!selected) return;

        const viewer = pdfViewerRef.current;
        if (!viewer) return;

        viewer.navigation.goToPage(selected.page);
        
        const annotation = viewer.annotationCollection?.find(
            (a: any) => a.customData?.searchId === selected.id
        );
        if (annotation) {
            setTimeout(() => {
                viewer.annotation.selectAnnotation(annotation.annotationId);
            }, 200);
        }
    };

    const handleNextHighlight = () => {
        if (searchResults.length === 0) return;

        let nextIndex = 0;
        if (selectedOccurrence) {
            const currentIndex = searchResults.findIndex((x: any) => x.id === selectedOccurrence);
            nextIndex = (currentIndex + 1) % searchResults.length;
        }

        const nextResult: any = searchResults[nextIndex];
        handleOccurrenceChange({ target: { value: nextResult.id } });
    };

    return (
        <div>
            {/* Right Panel - Results Display Panel */}
            <div className='command-panel'>
                {/* Header - Title */}
                <div className='command-header'>
                    <h3 style={{ margin: 0, padding: '10px' }}>Highlights in the document</h3>
                </div>

                {/* Content Area - Results/Highlights */}
                <div className='command-content'>
                    {searchResults.length > 0 && (
                        <>
                            <div className='results-count'>
                                Total Hits: <strong>{searchResults.length}</strong>
                            </div>
                            <div className='results-list'>
                                {searchResults.map((result: any, index) => (
                                    <div 
                                        key={index} 
                                        className={`result-item ${selectedOccurrence === result.id ? 'selected' : ''}`}
                                        onClick={() => handleOccurrenceChange({ target: { value: result.id } })}
                                        style={{
                                            cursor: 'pointer',
                                            padding: '12px',
                                            backgroundColor: selectedOccurrence === result.id ? '#e8f0fe' : '#f9f9f9',
                                            borderLeft: selectedOccurrence === result.id ? '4px solid #1f73e6' : '4px solid transparent',
                                            borderRadius: '2px',
                                            marginBottom: '8px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div className='result-page' style={{ fontSize: '12px', fontWeight: '600', color: '#1f73e6', marginBottom: '8px' }}>
                                            Page {result.page}
                                        </div>
                                        <div className='result-occurrence' style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>
                                            {result.title}
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
                            <p>Searching for content...</p>
                            <p className='text-muted'>The PDF is being scanned for the 3 search terms.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}