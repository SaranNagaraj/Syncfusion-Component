import React, { useRef } from "react";
import {
    DocumentEditorContainerComponent,
    Toolbar, Ribbon
} from '@syncfusion/ej2-react-documenteditor';
import "./DocxEditor.css"
import DocxEditorSidePanel from "./DocxEditorSidePanel";

DocumentEditorContainerComponent.Inject(Toolbar, Ribbon);

const DocxEditor = () => {
    const docxEditorRef = useRef<any>(null);
    return (
         <div className="docx-layout">
            <div className='docx-viewer-panel'>
            <DocumentEditorContainerComponent
                id="container"
                ref={docxEditorRef}
                height="100%"
                // Use the following service URL only for demo purposes
                toolbarMode="Ribbon"
                serviceUrl="https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/"
                enableToolbar={true}
            />
            </div>
            <DocxEditorSidePanel docxEditorRef={docxEditorRef}/>
        </div>
    );
};

export default DocxEditor;