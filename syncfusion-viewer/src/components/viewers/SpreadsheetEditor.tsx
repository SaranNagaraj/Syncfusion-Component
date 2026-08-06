import { useRef } from "react";
import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';
import './Spreadsheet.css';
import SpreadsheetSidePanel from "./SpreadsheetSidePanel";

const SpreadsheetEditor = () => {
const spreadsheetRef = useRef<SpreadsheetComponent>(null);
const sidePanelRef = useRef<{ findRecord: () => void }>(null);

  const onCreated = () => {
    fetch('/Employees_Sales_Inventory.xlsx')
      .then((response) => response.blob())
      .then((fileBlob) => {
        const file = new File([fileBlob], 'Sample.xlsx');
        spreadsheetRef.current?.open({ file });
      });
  };

  const openComplete = () =>{
    sidePanelRef.current?.findRecord();
  }
  
  return (
    <div className='control-section'>
      <div className='spreadsheet-viewer-panel'>
        <SpreadsheetComponent
          ref={spreadsheetRef}
          height="100%"
          width="100%"
          openUrl="https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/open"
          saveUrl="https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/save"
          created={onCreated.bind(this)}
          openComplete = {openComplete}
          >
        </SpreadsheetComponent>
      </div>
      <SpreadsheetSidePanel ref={sidePanelRef} spreadsheetRef={spreadsheetRef}/>
    </div>
  );
};

export default SpreadsheetEditor;