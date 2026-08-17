import { useRef } from "react";
import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';
import '../../index.css';
import SpreadsheetSidePanel from "./SpreadsheetSidePanel";
import { API_BASE } from "../../config";

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
    <div className='spreadsheet-layout'>
      <div className='spreadsheet-viewer-panel'>
        <SpreadsheetComponent
          ref={spreadsheetRef}
          height="100%"
          width="100%"
          openUrl={`${API_BASE}/OpenExcel`}
          saveUrl={`${API_BASE}/SaveExcel`}
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