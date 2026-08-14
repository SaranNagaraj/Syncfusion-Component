import { useRef, useState} from 'react';
import { PdfViewerComponent, Toolbar, Inject, Magnification, Navigation, Annotation, LinkAnnotation, ThumbnailView, BookmarkView,
  TextSearch, TextSelection, FormFields, Print, FormDesigner, PageOrganizer, CustomToolbarItem } from '@syncfusion/ej2-react-pdfviewer';
import type { ToolbarItem } from '@syncfusion/ej2-react-pdfviewer';
import PresentationSidePanel from "./PresentationSidePanel";
import { API_BASE } from "../../config";
import "./Presentation.css"

const PresentationViewer = () => {
    const [searchWord, setSearchWord] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const pdfViewerRef = useRef<any>(null);
    let speakerNotes: any;
    const toolbarItems: (CustomToolbarItem | ToolbarItem)[] = [{ prefixIcon: 'e-icons e-folder', id: 'ppt_file_Open', tooltipText: 'Open' } as CustomToolbarItem,
      'UndoRedoTool', 'PageNavigationTool', 'MagnificationTool',
      'PanTool', 'SelectionTool', 'CommentTool', 'SubmitForm', 'AnnotationEditTool',
      'FormDesignerEditTool', 'SearchOption',
      'PrintOption', 'DownloadOption'
    ];
    const resourceLoaded = async () => {
        try {
            const response = await fetch("/MarketOpportunity.pptx");
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onload = () => {
                loadPPT(reader.result);
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error(error);
        }
    };

    const toolbarClickHandler = (args: any) => {
        if (args.item.id === 'ppt_file_Open') {
          let fileUpload: HTMLElement | null = document.getElementById('pv-fileUpload');
          fileUpload?.click();
        }
    }

    const readFile = (args: any) => {
        const uploadedFile = args.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            loadPPT(reader.result);
        };
        reader.readAsDataURL(uploadedFile);
    };

    const loadPPT = (base64Data: any) => {
        const post = JSON.stringify({
            data: base64Data
        });
        const url = `${API_BASE}/PPTLoadFile`;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              speakerNotes = response.speakerNotes;
              pdfViewerRef.current.documentPath = response.pdfBase64;
              pdfViewerRef.current.documentLoad = () => {
                if (Object.keys(speakerNotes).length > 0) {
                  handleSearch(speakerNotes);
                }
              }
            }
        };
        xhr.send(post);
    };

    const handleSearch = async (speakerNotes: any) => {
        const viewer = pdfViewerRef.current;
        if (!viewer) return;
        const aggregated: any = [];
        let totalOccurrences = 0;
        let slideOccurrenceCount = 0;
        try {
          const slideKeys = Object.keys(speakerNotes);
          for (const slideNo of slideKeys) {
            const noteText = speakerNotes[slideNo];
            if (!noteText) continue;
            const results = await viewer.textSearch.findTextAsync(noteText, true);
            const pagesTouched = new Set<number>();
            for (const pageResult of results) {
                if (!pageResult?.bounds?.length) continue;
                const pageNumber = (pageResult.pageIndex ?? -1) + 1;
                if (pageNumber < 1) continue;
                pagesTouched.add(pageNumber);
                const bounds = [];
                for (const bound of pageResult.bounds) {
                    bounds.push({
                        x: px(bound.x),
                        y: px(bound.y),
                        width: px(bound.width),
                        height: px(bound.height)
                    });
                }
                const highlightId = `Highlight_${pageNumber}_${slideNo}`;
                viewer.annotation.addAnnotation('Highlight', {
                    bounds: bounds,
                    pageNumber: pageNumber,
                    customData: {
                        searchId: highlightId
                    }
                });
            }
            slideOccurrenceCount++;
            aggregated.push({
                id: `slide_${slideNo}`,
                slideNo: slideNo,
                note: noteText,
                page: pagesTouched.size > 0 ? Math.min(...pagesTouched) : null,
                pages: Array.from(pagesTouched).sort((a, b) => a - b),
                occurrenceCount: slideOccurrenceCount
            });
          }
          totalOccurrences = slideOccurrenceCount;
          setSearchResults(aggregated);
          setSearchWord(`Found ${totalOccurrences} speaker notes`);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
            setSearchWord('Search failed. Please try again.');
        }
    };

    const px = (pt: number) => (pt * 96) / 72;

    return (
        <div className="pdf-layout">
            <input type="file" id="pv-fileUpload" accept=".ppt,.pptx,.pptm,.pot,.potx,.potm" onChange={readFile.bind(this)} style={{ 'display': 'block', 'visibility': 'hidden', 'width': '0', 'height': '0' }} />
            <div className='pdf-viewer-panel'>
                <PdfViewerComponent 
                        ref={pdfViewerRef}
                        id="container"
                        resourcesLoaded={resourceLoaded}
                        resourceUrl="https://cdn.syncfusion.com/ej2/33.2.15/dist/ej2-pdfviewer-lib"
                        toolbarSettings= {{ toolbarItems: toolbarItems }} toolbarClick={toolbarClickHandler}>
                        <Inject services={[ Toolbar, Magnification, Navigation, Annotation, LinkAnnotation,
                                            BookmarkView, ThumbnailView, Print, TextSelection, TextSearch,
                                            FormFields, FormDesigner, PageOrganizer ]}/>
                    </PdfViewerComponent>
            </div>
            <PresentationSidePanel 
                pdfViewerRef={pdfViewerRef}
                searchWord={searchWord}
                searchResults={searchResults}
            />

        </div>
    );
};

export default PresentationViewer;