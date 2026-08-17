import React, { useEffect, useState } from "react";
import "./DocxEditor.css";

interface Props {
    docxEditorRef: React.RefObject<any>;
}

interface Finding {
    bookmark: string;
    pageNumber: number;
    preview: string;
}

const PARAGRAPHS = [
    {
        bookmark: "Bookmark_1",
        text:
            "While most adore their fluffy fur and round heads, which help give them their cuddly bear quality, others are fascinated by the many mysteries of the giant panda."
    },
    {
        bookmark: "Bookmark_2",
        text:
            "DNA analysis has put one mystery to rest. It has revealed that while the red panda is a distant relation, the giant panda's closest relative is the spectacled bear from South America."
    },
    {
        bookmark: "Bookmark_3",
        text:
            "Researchers have recently discovered that the gene responsible for tasting savory or umami flavors, such as meat, is inactive in giant pandas."
    }
];

export default function DocxEditorSidePanel({
    docxEditorRef
}: Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [findings, setFindings] = useState<Finding[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            createBookmarks();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const getPreview = (text: string) => {
        return text.split(" ").slice(0, 8).join(" ") + "...";
    };

    const createBookmarks = () => {
        const editor = docxEditorRef.current?.documentEditor;

        if (!editor) {
            return;
        }
        const data: Finding[] = [];

        PARAGRAPHS.forEach((item) => {
            editor.search.findAll(item.text);

            const results = editor.search.searchResults;

            if (results.length > 0) {

                // Select the found text
                editor.search.searchResults.index = 0;

                // Get page number
                const pageNumber = editor.selection.startPage;

                // Highlight
                editor.selection.characterFormat.highlightColor =
                    "Yellow";

                // Bookmark
                editor.editor.insertBookmark(item.bookmark);

                data.push({
                    bookmark: item.bookmark,
                    pageNumber,
                    preview: getPreview(item.text)
                });
            }

            results.clear();
        });

        editor.selection.moveToDocumentStart()
        editor.editor.enforceProtection('123', 'CommentsOnly');

        setFindings(data);

    };

    const navigateToBookmark = (
        bookmark: string,
        index: number
    ) => {
        const editor = docxEditorRef.current?.documentEditor;

        if (!editor) {
            return;
        }

        editor.selection.selectBookmark(bookmark);
        setActiveIndex(index);
    };

    const nextHighlight = () => {
        const nextIndex =
            (activeIndex + 1) % findings.length;

        navigateToBookmark(
            findings[nextIndex].bookmark,
            nextIndex
        );
    };

    return (
        <div className="findings-panel">
            <h3>Findings in document</h3>

            <div className="hits-count">
                {findings.length} hits
            </div>

            <div className="divider"></div>

            {findings.map((item, index) => (
                <div
                    key={item.bookmark}
                    className={`finding-card ${activeIndex === index ? "active" : ""
                        }`}
                    onClick={() =>
                        navigateToBookmark(
                            item.bookmark,
                            index
                        )
                    }
                >
                    <div className="result-page">
                        Page {item.pageNumber}
                    </div>

                    <div className="result-highlight">
                        {item.preview}
                    </div>
                </div>
            ))}

            <button
                className="action-button"
                onClick={nextHighlight}
            >
                Next Highlight →
            </button>
        </div>
    );
}