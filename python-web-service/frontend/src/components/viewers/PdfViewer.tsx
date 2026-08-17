import { useRef } from 'react';
import {
    PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
    ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner,
    PageOrganizer, Inject
} from '@syncfusion/ej2-react-pdfviewer';
import PdfViewerSidePanel from "./PdfViewerSidePanel";
import '../../index.css';

const PdfViewer = () => {
    const pdfViewerRef = useRef<any>(null);
    return (
        <div className="pdf-layout">
            <div className='pdf-viewer-panel'>
                <PdfViewerComponent
                    ref={pdfViewerRef}
                    id="container"
                    height="100%"
                    documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
                    resourceUrl="https://cdn.syncfusion.com/ej2/33.2.15/dist/ej2-pdfviewer-lib">
                    <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation,
                        BookmarkView, ThumbnailView, Print, TextSelection, TextSearch,
                        FormFields, FormDesigner, PageOrganizer]} />
                </PdfViewerComponent>
            </div>
            <PdfViewerSidePanel 
                pdfViewerRef={pdfViewerRef}
            />

        </div>
    );
};

export default PdfViewer;