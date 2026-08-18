import React, { useEffect, useRef, useState } from "react";
import "./DocxEditor.css";
import { DialogComponent } from "@syncfusion/ej2-react-popups";

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
        bookmark: "Para_Bookmark_1",
        text: "While most adore their fluffy fur and round heads, which help give them their cuddly bear quality, others are fascinated by the many mysteries of the giant panda."
    },
    {
        bookmark: "Para_Bookmark_2",
        text: "DNA analysis has put one mystery to rest. It has revealed that while the red panda is a distant relation, the giant panda's closest relative is the spectacled bear from South America."
    },
    {
        bookmark: "Para_Bookmark_3",
        text: "Researchers have recently discovered that the gene responsible for tasting savory or umami flavors, such as meat, is inactive in giant pandas."
    }
];

export default function DocxEditorSidePanel({
    docxEditorRef
}: Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [findings, setFindings] = useState<Finding[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedText, setSelectedText] = useState("");
    const [bookmarkList, setBookmarkList] = useState<string[]>([]);
    const bookmarkRef = useRef("");
    const dialogRef = useRef<DialogComponent>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            createBookmarks();
        }, 1000);

        const editor = docxEditorRef.current?.documentEditor;

        if (editor) {

            const menuItems = [
                {
                    text: "Highlight and Link",
                    id: "highlight_and_link"
                }
            ];

            editor.contextMenu.addCustomMenu(menuItems, false);

            editor.customContextMenuSelect = (args: any) => {
                console.log("Menu Clicked", args);

                if (
                    (args.id === "highlight_and_link" ||
                        args.id?.endsWith("highlight_and_link")) &&
                    !editor.selection.isEmpty &&
                    /\S/.test(editor.selection.text || "")
                ) {
                    setSelectedText(
                        editor.selection.text || ""
                    );

                    const bookmarks =
                        editor.getBookmarks() || [];

                    setBookmarkList(bookmarks);

                    if (bookmarks.length > 0) {
                        bookmarkRef.current = bookmarks[0];
                    }

                    setDialogVisible(true);
                }
            };
        }

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
                editor.search.searchResults.index = 0;

                const pageNumber = editor.selection.startPage;

                editor.selection.characterFormat.highlightColor =
                    "Yellow";

                editor.editor.insertBookmark(item.bookmark);

                data.push({
                    bookmark: item.bookmark,
                    pageNumber,
                    preview: getPreview(item.text)
                });
            }

            results.clear();
        });

        editor.selection.moveToDocumentStart();
        // editor.editor.enforceProtection("123","CommentsOnly");

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
        if (findings.length === 0) {
            return;
        }

        const nextIndex =
            (activeIndex + 1) % findings.length;

        navigateToBookmark(
            findings[nextIndex].bookmark,
            nextIndex
        );
    };

    const dialogButtons = [
        {
            buttonModel: {
                content: "OK",
                isPrimary: true
            },
            click: () => {
                console.log("OK Clicked");

                const editor =
                    docxEditorRef.current?.documentEditor;

                if (!editor) {
                    console.log("Editor not found");
                    return;
                }

                const chosenBookmark =

                    (document.getElementById(

                        "bookmarkDropdown"

                    ) as HTMLSelectElement).value;

                console.log(chosenBookmark);

                if (!chosenBookmark) {
                    console.log("Bookmark not selected");
                    return;
                }

                let startOffset = editor.selection.startOffset;

                const fieldCode =
                    `HYPERLINK \\l "${chosenBookmark}"`;

                editor.editor.insertField(
                    fieldCode,
                    selectedText
                );

                let endOffset = editor.selection.endOffset;
                editor.selection.select(startOffset, endOffset);
                editor.selection.characterFormat.highlightColor = 'Red';

                setDialogVisible(false);
            }
        },
        {
            buttonModel: {
                content: "Cancel"
            },
            click: () => {
                console.log("Cancel Clicked");
                setDialogVisible(false);
            }
        }
    ];

    return (
        <>
            <DialogComponent
                ref={dialogRef}
                header="Highlight and Link"
                width="500px"
                visible={dialogVisible}
                isModal={true}
                showCloseIcon={true}
                cssClass="highlight-link-dialog-wrapper"
                buttons={dialogButtons}
                close={() => setDialogVisible(false)}
            >
                <div className="highlight-link-dialog">

                    <div className="dialog-field">
                        <label className="dialog-label">
                            Text to display
                        </label>

                        <input
                            className="dialog-input"
                            value={selectedText}
                            readOnly
                        />
                    </div>

                    <div className="dialog-field">
                        <label className="dialog-label">
                            Bookmark
                        </label>

                        <select
                            id="bookmarkDropdown"
                            className="dialog-select"
                            defaultValue={bookmarkRef.current || bookmarkList[0]}
                        >
                            {bookmarkList.map((bookmark) => (
                                <option key={bookmark} value={bookmark}>
                                    {bookmark}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </DialogComponent>

            <div className="findings-panel">
                <h3>Findings in document</h3>

                <div className="hits-count">
                    {findings.length} hits
                </div>

                <div className="divider"></div>

                {findings.map((item, index) => (
                    <div
                        key={item.bookmark}
                        className={`finding-card ${activeIndex === index
                            ? "active"
                            : ""
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
        </>
    );
}