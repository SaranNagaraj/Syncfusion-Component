import React from "react";
import {
    DocumentEditorContainerComponent,
    Toolbar
} from '@syncfusion/ej2-react-documenteditor';
import "./DocxEditor.css"

DocumentEditorContainerComponent.Inject(Toolbar);

const DocxEditor = () => {
    return (
        <div style={{ height: "100%" }}>
            <DocumentEditorContainerComponent
                id="container"
                height="590px"
                // Use the following service URL only for demo purposes
                serviceUrl="https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/"
                enableToolbar={true}
            />
        </div>
    );
};

export default DocxEditor;