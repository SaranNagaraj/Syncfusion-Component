from flask import Flask, json, request, Response, send_file
from flask_cors import CORS #import CORS from flask_cors

import clr #import clr from pythonnet
import os
from io import BytesIO

app = Flask(__name__)
# CORS(app) #enable CORS on the app

# ---- Minimal CORS + large-file support ----
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024 # 500 MB
app.config['MAX_FORM_MEMORY_SIZE'] = 500 * 1024 * 1024 # 500 MB

CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=False,
    expose_headers=["Content-Disposition", "Content-Length", "Content-Type"],
)

# Force CORS headers on EVERY response (including 413/500 errors)
@app.after_request
def add_cors_on_errors(resp):
    resp.headers["Access-Control-Allow-Origin"]  = "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return resp
# -------------------------------------------

# get the current working directory
current_working_directory = os.getcwd()

#load our dll file(mine is in my C:/ folder)
clr.AddReference(current_working_directory + "/.NET Standard Wrapper Library/WebServiceLibrary/bin/Release/netstandard2.0/publish/WebServiceLibrary.dll")
clr.AddReference(current_working_directory + "/.NET Standard Wrapper Library/WebServiceLibrary/bin/Release/netstandard2.0/publish/Syncfusion.EJ2.DocumentEditor.dll")
clr.AddReference(current_working_directory + "/.NET Standard Wrapper Library/WebServiceLibrary/bin/Release/netstandard2.0/publish/Syncfusion.DocIO.Portable.dll")
clr.AddReference(current_working_directory + "/.NET Standard Wrapper Library/WebServiceLibrary/bin/Release/netstandard2.0/publish/Syncfusion.Compression.Portable.dll")
clr.AddReference(current_working_directory + "/.NET Standard Wrapper Library/WebServiceLibrary/bin/Release/netstandard2.0/publish/Syncfusion.OfficeChart.Portable.dll")
clr.AddReference(current_working_directory + "/.NET Standard Wrapper Library/WebServiceLibrary/bin/Release/netstandard2.0/publish/Syncfusion.Licensing.dll")
clr.AddReference(current_working_directory + "/.NET Standard Wrapper Library/WebServiceLibrary/bin/Release/netstandard2.0/publish/Newtonsoft.Json.dll")
clr.AddReference(current_working_directory + "/.NET Standard Wrapper Library/WebServiceLibrary/bin/Release/netstandard2.0/publish/System.Text.Encoding.CodePages.dll")

# Load explicit DLLs from the publish folder (direct AddReference calls)
publish_base = current_working_directory + "/.NET Standard Wrapper Library/WebServiceLibrary/bin/Release/netstandard2.0/publish/"


clr.AddReference(publish_base + "Syncfusion.EJ2.Spreadsheet.dll")
clr.AddReference(publish_base + "BitMiracle.LibTiff.NET.dll")
clr.AddReference(publish_base + "HarfBuzzSharp.dll")
clr.AddReference(publish_base + "Microsoft.Bcl.AsyncInterfaces.dll")
clr.AddReference(publish_base + "Newtonsoft.Json.dll")
clr.AddReference(publish_base + "SkiaSharp.dll")
clr.AddReference(publish_base + "SkiaSharp.HarfBuzz.dll")
clr.AddReference(publish_base + "WebServiceLibrary.dll")
clr.AddReference(publish_base + "Syncfusion.Compression.Portable.dll")
clr.AddReference(publish_base + "Syncfusion.EJ2.dll")
clr.AddReference(publish_base + "Syncfusion.Licensing.dll")
clr.AddReference(publish_base + "Syncfusion.MetafileRenderer.Portable.dll")
clr.AddReference(publish_base + "Syncfusion.Pdf.Imaging.Portable.dll")
clr.AddReference(publish_base + "Syncfusion.Pdf.Portable.dll")
clr.AddReference(publish_base + "Syncfusion.SkiaSharpHelper.Portable.dll")
clr.AddReference(publish_base + "Syncfusion.XlsIO.Portable.dll")
clr.AddReference(publish_base + "Syncfusion.XlsIORenderer.Portable.dll")
clr.AddReference(publish_base + "System.Buffers.dll")
clr.AddReference(publish_base + "System.Memory.dll")
clr.AddReference(publish_base + "System.Numerics.Vectors.dll")
clr.AddReference(publish_base + "System.Runtime.CompilerServices.Unsafe.dll")
clr.AddReference(publish_base + "System.Text.Encoding.CodePages.dll")
clr.AddReference(publish_base + "System.Text.Encodings.Web.dll")
clr.AddReference(publish_base + "System.Text.Json.dll")
clr.AddReference(publish_base + "System.Threading.Tasks.Extensions.dll")
clr.AddReference(publish_base + "Microsoft.AspNetCore.Mvc.Core.dll")
clr.AddReference(publish_base + "Microsoft.AspNetCore.Mvc.Abstractions.dll")
clr.AddReference(publish_base + "Microsoft.AspNetCore.Razor.dll")

#import our Documenteditor class from our C# namespace DocumentEditorLibrary
from WebServiceLibrary import WebService
from Syncfusion.Licensing import SyncfusionLicenseProvider

#import our SpreadsheetEditor class from our C# namespace SpreadsheetLibrary
from WebServiceLibrary import WebService
from Syncfusion.EJ2.Spreadsheet import SaveSettings, SaveType
from Syncfusion.Licensing import SyncfusionLicenseProvider
from System import Enum
from System.IO import SeekOrigin

# Register Syncfusion license
SyncfusionLicenseProvider.RegisterLicense("Enter your license key here")

docEditor = WebService() #create our Documenteditor object

@app.route('/Import', methods=['POST'])
def importDocument():
    if 'files' in request.files:
        files = request.files['files']
        # Get the stream data
        stream_data = files.stream.read()
        # Get the file name
        file_name = files.filename
        # Calling our Import method from our Documenteditor class which will return the SFDT string
        return docEditor.Import(stream_data, file_name)
    else:
        return ""

@app.route('/SystemClipboard', methods=['POST'])
def systemClipboard():
    # Get the SFDT data from the request
    content = request.json['content']
    # Get the type from the request
    type = request.json['type']
    # Calling our SystemClipboard method from our Documenteditor class which will return the SFDT string
    return docEditor.SystemClipboard(content, type)

@app.route('/RestrictEditing', methods=['POST'])
def restrictEditing():
    passwordBase64 = request.json['passwordBase64']
    slatBase64 = request.json['saltBase64']
    spinCount = request.json['spinCount']
    # Calling our RestrictEditing method from our Documenteditor class which will return the array of System.String represents the password and salt value.
    jsonString = docEditor.RestrictEditing(passwordBase64, slatBase64, spinCount)
    return json.loads(jsonString)

@app.route('/Save', methods=['POST'])
def save():
    # Get the SFDT data from the request
    content = request.json['content']
    # Get the file name from the request
    fileName = request.json['fileName']
    # Calling our Save method from our Documenteditor class which will save the document in the given file name.
    result = docEditor.Save(content, fileName)
    print(result)
    return result

# Register Syncfusion license
SyncfusionLicenseProvider.RegisterLicense("Your License key")

spreadEditor = WebService() #create our SpreadsheetEditor object

@app.route('/OpenExcel', methods=['POST'])
def openExcel():
    if 'file' in request.files:
        files = request.files['file']
        # Get the stream data
        print(files)
        stream_data = files.stream.read()
        # Calling our Open method from our SpreadsheetEditor class which will return the Workbook JSON string
        return spreadEditor.Open(stream_data)
    else:
        return ""

@app.route('/SaveExcel', methods=['POST'])
def saveExcel():
    try:
        # Extract parameters from form data
        json_data = request.form.get('JSONData', '')
        save_type = request.form.get('saveType', 'Xlsx')  # Default to Xlsx
        file_name = request.form.get('fileName', 'Sample')
        
        # Extract PDF layout settings if provided
        pdf_layout_settings = request.form.get('pdfLayoutSettings', '{}')
        
        # Create SaveSettings object
        save_settings = SaveSettings()
        save_settings.JSONData = json_data
        # Convert string to SaveType enum
        save_settings.SaveType = Enum.Parse(SaveType, save_type)
        save_settings.FileName = file_name
        save_settings.PdfLayoutSettings = pdf_layout_settings
        
        # Call the Save method from SpreadsheetEditor class
        file_stream = spreadEditor.Save(save_settings)
        
        # Convert .NET MemoryStream to bytes
        file_stream.Seek(0, SeekOrigin.Begin)  # Seek to beginning
        stream_bytes = file_stream.ToArray()  # Convert to byte array
        file_stream.Dispose()  # Clean up the stream
        
        # Convert bytes to BytesIO for Flask
        output = BytesIO(stream_bytes)
        output.seek(0)
        
        extension = f".{save_type.lower()}"
        # Get the mime type based on the save type.
        mime_type = {
            "xls":  "application/vnd.ms-excel",
            "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "pdf": "application/pdf",
            "csv": "text/csv"
        }.get(save_type.lower(), "application/octet-stream")

        return send_file(
            output,
            as_attachment=True,
            download_name=f"{file_name}{extension}",
            mimetype=mime_type
        )

    except Exception as e:
        import traceback
        error_msg = f"Error saving file: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        return error_msg, 500

@app.route("/")
def home():
    return "Flask Web API for DocumentEditor!"

if __name__ == "__main__":
    app.run(debug=True) # http://localhost:5000/
    # app.run(host='', port=5001, debug=True) # http://localhost:5001/
