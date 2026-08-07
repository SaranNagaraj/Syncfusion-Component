import React from "react";
import type { ViewerType } from "../types";

interface Props {
  selected: ViewerType;
  onSelect: (type: ViewerType) => void;
}

const Sidebar: React.FC<Props> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="sidebar">

      <button
        className={selected === "docx" ? "active" : ""}
        onClick={() => onSelect("docx")}
      >
        Word Document
      </button>

      <button
        className={selected === "presentation" ? "active" : ""}
        onClick={() => onSelect("presentation")}
      >
        Presentation
      </button>

      <button
        className={selected === "spreadsheet" ? "active" : ""}
        onClick={() => onSelect("spreadsheet")}
      >
        Spreadsheet
      </button>

      <button
        className={selected === "pdf" ? "active" : ""}
        onClick={() => onSelect("pdf")}
      >
        PDF Document
      </button>

    </div>
  );
};

export default Sidebar;