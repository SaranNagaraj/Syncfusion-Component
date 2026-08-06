import { useState } from "react";

import Sidebar from "./components/Sidebar";

import DocxEditor from "./components/viewers/DocxEditor";
import PresentationViewer from "./components/viewers/PresentationViewer";
import SpreadsheetEditor from "./components/viewers/SpreadsheetEditor";
import PdfViewer from "./components/viewers/PdfViewer";
import "./App.css"

import type { ViewerType } from "./types";

function App() {
  const [selected, setSelected] =
    useState<ViewerType>("docx");

  const renderViewer = () => {
    switch (selected) {
      case "docx":
        return <DocxEditor />;

      case "presentation":
        return <PresentationViewer />;

      case "spreadsheet":
        return <SpreadsheetEditor />;

      case "pdf":
        return <PdfViewer />;

      default:
        return null;
    }
  };

  return (
    <div className="app-layout">

      <Sidebar
        selected={selected}
        onSelect={setSelected}
      />

      <main className="viewer-container">
        {renderViewer()}
      </main>

    </div>
  );
}

export default App;
