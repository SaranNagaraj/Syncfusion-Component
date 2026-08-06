import { useState } from "react";

import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";

import DocxEditor from "./components/viewers/DocxEditor";
import PresentationViewer from "./components/viewers/PresentationViewer";
import SpreadsheetViewer from "./components/viewers/SpreadsheetViewer";
import PdfViewer from "./components/viewers/PdfViewer";
import "./App.css"

import type { ViewerType } from "./types";

function App() {
  const [selected, setSelected] =
    useState<ViewerType>("docx");

  const [searchText, setSearchText] = useState("");

  const [results, setResults] = useState([
    {
      id: "1",
      pageNumber: 12,
      title: "GRANT OF LICENSE",
    },
    {
      id: "2",
      pageNumber: 45,
      title: "RESTRICTIONS",
    },
    {
      id: "3",
      pageNumber: 89,
      title: "TERMINATION",
    },
  ]);

  const handleSearch = () => {
    console.log("Search:", searchText);
  };

  const handleResultClick = (result: any) => {
    console.log("Navigate to:", result);
  };

  const renderViewer = () => {
    switch (selected) {
      case "docx":
        return <DocxEditor />;

      case "presentation":
        return <PresentationViewer />;

      case "spreadsheet":
        return <SpreadsheetViewer />;

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

      <RightPanel
        searchText={searchText}
        setSearchText={setSearchText}
        hitCount={results.length}
        results={results}
        onSearch={handleSearch}
        onResultClick={handleResultClick}
      />

    </div>
  );
}

export default App;
