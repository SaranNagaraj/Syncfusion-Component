import React from "react";
import { useState } from 'react';
import "./PdfViewer.css"

interface Props {
    pdfViewerRef: React.RefObject<any>;
}

export default function PdfViewerSidePanel({
    pdfViewerRef
}: Props) {
    const [searchWord, setSearchWord] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [addedAnnotationIds, setAddedAnnotationIds] = useState([]);
    const [selectedOccurrence, setSelectedOccurrence] = useState('');

    const px = (pt) => (pt * 96) / 72;

    const handleSearch = async () => {
        if (!searchWord.trim()) {
            setSearchResults([]);
            return;
        }

        const viewer = pdfViewerRef.current;
        if (!viewer) return;

        try {
            const results = await viewer.textSearch.findTextAsync(searchWord, false);
            
            if (!results || results.length === 0) {
                setSearchResults([]);
                return;
            }

            const formattedResults = [];
            const annotationIds = [];
            let occurrenceIndex = 1;

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

                const highlightId = `Highlight_${pageNumber}_${occurrenceIndex}`;
                
                viewer.annotation.addAnnotation('Highlight', {
                    bounds: bounds,
                    pageNumber: pageNumber,
                    customData: {
                        searchId: highlightId
                    }
                });

                annotationIds.push({ pageNumber, annotationId: highlightId });
                formattedResults.push({
                    page: pageNumber,
                    highlight: searchWord,
                    id: highlightId,
                    occurrenceIndex: occurrenceIndex
                });

                occurrenceIndex++;
            }

            setSearchResults(formattedResults);
            setAddedAnnotationIds(annotationIds);
            if (formattedResults.length > 0) {
                const firstResult = formattedResults[0];
                setSelectedOccurrence(firstResult.id);
                viewer.navigation.goToPage(firstResult.page);
                
                const firstAnnotation = viewer.annotationCollection?.find(
                    (a) => a.customData?.searchId === firstResult.id
                );
                if (firstAnnotation) {
                    setTimeout(() => {
                        viewer.annotation.selectAnnotation(firstAnnotation.annotationId);
                    }, 200);
                }
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        }
    };

    const handleClear = () => {
        const viewer = pdfViewerRef.current;
        if (viewer && addedAnnotationIds.length > 0) {
            addedAnnotationIds.forEach((item) => {
                try {
                    const annotation = viewer.annotationCollection?.find(
                        (a) => a.customData?.searchId === item.annotationId
                    );
                    if (annotation) {
                        viewer.annotation.deleteAnnotationById(annotation.annotationId);
                    }
                } catch (e) {
                    console.log(e);
                }
            });
        }
        
        setSearchWord('');
        setSearchResults([]);
        setAddedAnnotationIds([]);
        setSelectedOccurrence('');
    };

    const handleOccurrenceChange = (event) => {
        const value = event.target.value;
        setSelectedOccurrence(value);

        const selected = searchResults.find((x) => x.id === value);
        if (!selected) return;

        const viewer = pdfViewerRef.current;
        if (!viewer) return;

        viewer.navigation.goToPage(selected.page);
        
        const annotation = viewer.annotationCollection?.find(
            (a) => a.customData?.searchId === selected.id
        );
        if (annotation) {
            setTimeout(() => {
                viewer.annotation.selectAnnotation(annotation.annotationId);
            }, 200);
        }
    };

    return (
        <div >
                {/* Right Panel - Command Panel */}
                <div className='command-panel'>
                    {/* Header - Search Input and Button */}
                    <div className='command-header'>
                        <input
                            type='text'
                            className='search-input'
                            placeholder='Enter search word...'
                            value={searchWord}
                            onChange={(e) => setSearchWord(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button className='search-button' onClick={handleSearch}>
                            Search
                        </button>
                    </div>

                    {/* Content Area - Results/Highlights */}
                    <div className='command-content'>
                        {searchResults.length > 0 && (
                            <>
                                <div className='results-count'>{searchResults.length} Occurrences</div>
                                <div className='results-list'>
                                    {searchResults.map((result, index) => (
                                        <div 
                                            key={index} 
                                            className={`result-item ${selectedOccurrence === result.id ? 'selected' : ''}`}
                                            onClick={() => handleOccurrenceChange({ target: { value: result.id } })}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className='result-page'>Page {result.page}</div>
                                            <div className='result-occurrence'>{result.highlight}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {searchResults.length === 0 && (
                            <div className='no-results'>
                                <p>No search results yet.</p>
                                <p className='text-muted'>Enter a search term and click "Search"</p>
                            </div>
                        )}
                    </div>

                    {/* Footer - Clear Button */}
                    <div className='command-footer'>
                        <button className='clear-button' onClick={handleClear}>
                            Clear
                        </button>
                    </div>
                </div>

            </div>
    );
}