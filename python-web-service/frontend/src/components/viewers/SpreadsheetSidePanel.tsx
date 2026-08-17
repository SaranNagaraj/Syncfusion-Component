import React from "react";
import { useState, useImperativeHandle, forwardRef } from 'react';
import "./Spreadsheet.css"

interface Props {
    spreadsheetRef: React.RefObject<any>;
}

const SpreadsheetSidePanel = forwardRef<
    { findRecord: () => void },
    Props
>(({ spreadsheetRef }, ref) => {
    const [searchWord, setSearchWord] = useState('Ava Wilson');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedOccurrence, setSelectedOccurrence] = useState(null);

    const findRecord = () => {
        if (searchWord) {
            let data: any = spreadsheetRef.current?.findAll(searchWord, "Workbook");
            setSearchResults(data);
        } else if (searchResults && searchResults.length) {
            handleClear();
        }
    };

    useImperativeHandle(ref, () => ({ findRecord }));

    const goToAddress = (address: string) => {
        if (address) {
            spreadsheetRef.current?.goTo(address);
        }
    };

    const handleClear = () => {
        setSearchWord('');
        setSearchResults([]);
        setSelectedOccurrence(null);
    };

    return (
        <div>
            {/* Right Panel - Command Panel */}
            <div className='command-panel' style={{ minWidth: 0, minHeight: 0 }}>
                {/* Header - Search Input and Button */}
                <div className='command-header'>
                    <input
                        type='text'
                        className='search-input'
                        placeholder='Enter search word...'
                        value={searchWord}
                        onChange={(e) => setSearchWord(e.target.value)}
                    />
                    <button className='search-button' onClick={findRecord}>
                        Search
                    </button>
                </div>

                {/* Content Area - Results/Highlights */}
                <div className='command-content'>
                    {searchResults.length > 0 && (
                        <>
                            <div className='results-count'>{searchResults.length} Occurrences</div>
                            <div className='results-list'>
                                {searchResults.map((address: string, index) => {
                                    const [sheetName, cellAddress] = address.split('!');
                                    return (
                                        <div
                                            key={index}
                                            className={`result-item ${selectedOccurrence === address ? 'selected' : ''}`}
                                            onClick={() => goToAddress(address)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className='result-page'>
                                                <span className='result-label'>Sheet: </span>
                                                {sheetName}
                                            </div>
                                            <div className='result-occurrence'>
                                                <span className='result-label'>Cell: </span>
                                                {cellAddress}
                                            </div>
                                        </div>
                                    );
                                })}
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
});

export default SpreadsheetSidePanel;
