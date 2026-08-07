import React, { useState } from "react";
import "./DocxEditor.css";

interface Props {
    docxEditorRef: React.RefObject<any>;
}

interface SearchOccurrence {
    id: string;
    index: number;
    text: string;
}

export default function DocxEditorSidePanel({
    docxEditorRef
}: Props) {

    const [searchWord, setSearchWord] = useState("");
    const [searchResults, setSearchResults] = useState<SearchOccurrence[]>([]);
    const [selectedOccurrence, setSelectedOccurrence] = useState("");

    const handleSearch = () => {

        const editorContainer = docxEditorRef.current;

        if (!editorContainer || !searchWord.trim()) {
            setSearchResults([]);
            return;
        }

        const documentEditor = editorContainer.documentEditor;

        try {

            documentEditor.search.findAll(searchWord);

            const results = documentEditor.search.searchResults;

            const occurrences: SearchOccurrence[] = [];

            for (let i = 0; i < results.length; i++) {

                let paragraphText = searchWord;

                try {
                    paragraphText =
                        documentEditor.selection.text ||
                        searchWord;
                } catch (e) {
                    console.log(e);
                }

                occurrences.push({
                    id: `result-${i}`,
                    index: i,
                    text: paragraphText
                });
            }

            setSearchResults(occurrences);

            if (occurrences.length > 0) {
                handleOccurrenceClick(0);
            }

        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        }
    };

    const handleOccurrenceClick = (index: number) => {

        const editorContainer = docxEditorRef.current;

        if (!editorContainer) {
            return;
        }

        const documentEditor = editorContainer.documentEditor;
        const results = documentEditor.search.searchResults;

        if (!results || index >= results.length) {
            return;
        }

        const offsets =
            results.getTextSearchResultsOffset();

        if (!offsets || !offsets[index]) {
            return;
        }

        const selectedOffset = offsets[index];

        setSelectedOccurrence(`result-${index}`);

        documentEditor.selection.select(
            selectedOffset.startOffset,
            selectedOffset.endOffset
        );
    };

    const handleClear = () => {

        const editorContainer = docxEditorRef.current;

        if (editorContainer) {
            editorContainer.documentEditor.search.clearSearchHighlight();
        }

        setSearchWord("");
        setSearchResults([]);
        setSelectedOccurrence("");
    };

    return (
        <div className="command-panel">

            {/* Header */}

            <div className="command-header">

                <input
                    type="text"
                    className="search-input"
                    placeholder="Enter search text..."
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />

                <button
                    className="search-button"
                    onClick={handleSearch}
                >
                    Search
                </button>

            </div>

            {/* Results */}

            <div className="command-content">

                {searchResults.length > 0 ? (
                    <>
                        <div className="results-count">
                            {searchResults.length} Occurrences
                        </div>

                        <div className="results-list">

                            {searchResults.map((result) => (

                                <div
                                    key={result.id}
                                    className={`result-item ${selectedOccurrence === result.id
                                            ? "selected"
                                            : ""
                                        }`}
                                    onClick={() =>
                                        handleOccurrenceClick(result.index)
                                    }
                                >

                                    <div className="result-title">
                                        Occurrence {result.index + 1}
                                    </div>

                                    <div className="result-paragraph">
                                        {result.text}
                                    </div>

                                </div>

                            ))}

                        </div>
                    </>
                ) : (
                    <div className="no-results">
                        <p>No search results found.</p>
                        <p className="text-muted">
                            Enter text and click Search.
                        </p>
                    </div>
                )}

            </div>

            {/* Footer */}

            <div className="command-footer">

                <button
                    className="clear-button"
                    onClick={handleClear}
                >
                    Clear
                </button>

            </div>

        </div>
    );
}