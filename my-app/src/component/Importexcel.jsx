import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Importexcel.css";
import sampleexcel from "../Images/excelsheet.png";

const ExcelModal = ({ isOpen, onClose, previewContent = [],bgcolor}) => {
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState("");
  const [previewtext, setPreviewtext] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(false); // State for loader

  useEffect(() => {
    if (isOpen) {
      console.log("previewContent in SendexcelModal:",previewContent,bgcolor);
    }
  }, [isOpen, previewContent,bgcolor]);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  setFileName(file.name);
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Format the data as required
    const formattedData = jsonData
      .map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (colIndex === 10 && typeof cell === 'number') { // Assuming date is in column 10 (11th column)
            // Convert Excel date to JS date
            const jsDate = new Date(Math.round((cell - 25569) * 86400 * 1000)); // Excel date to JS timestamp
            return jsDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
          }
          return cell;
        })
      )
      .filter(row => row.some(cell => cell)); // Filter out empty rows

    setExcelData(formattedData);
    console.log(formattedData); // Log to verify data after conversion
  };

  reader.readAsArrayBuffer(file);
};

const handleSend = async () => {
  if (excelData.length === 0) {
    toast.error("Please upload an Excel file first.");
    return;
  }

  const [headers, ...rows] = excelData;
  if (!headers.includes("Email")) {
    toast.error("Excel file must have an 'Email' column.");
    return;
  }

  const emailIndex = headers.indexOf("Email");

  if (!previewContent || previewContent.length === 0) {
    toast.error("No Preview Content provided.");
    return;
  }
    if (!previewtext) {
    toast.error("Please Enter Previewtext.");
    return;
  }
    if (!message) {
    toast.error("Please Enter Subject");
    return;
  }

  try {
    setIsLoading(true); // Show loader

    for (const row of rows) {
      const email = row[emailIndex];
      if (!email) continue; // Skip if email is missing in the row

      // Generate personalized content from template
      const personalizedContent = previewContent.map((item) => {
        const personalizedItem = { ...item }; // Copy the structure

       if (item.content) {
    headers.forEach((header, index) => {
    const placeholder = new RegExp(`{?${header.trim()}\\}?`, 'g'); // Match both Lname and {Lname}
    const cellValue = row[index] !== undefined && row[index] !== null ? String(row[index]).trim() : ''; // Convert to string and trim
    personalizedItem.content = personalizedItem.content.replace(placeholder, cellValue);
  });
}
        return personalizedItem;
      });

      const emailData = {
        recipientEmail:email,
        subject: message,
        body: JSON.stringify(personalizedContent),
        bgcolor,
        previewtext,
        userId:user.id,
      };

      console.log("Sending email data:", emailData); // Debugging info
      await axios.post("http://localhost:5000/sendexcelEmail", emailData);
    }

    toast.success("Emails sent successfully!");
    setTimeout(() => {
      onClose();
    }, 3000);
    setIsLoading(false);
  } catch (error) {
    console.error("Error sending emails:", error.response?.data || error.message);
    setIsLoading(false);
    toast.error("Failed to send emails. Check the console for details.");
  }
};


if (!isOpen) return null;

  return (
    <div className="excel-modal-overlay">
      <div className="excel-modal-content">
        <button className="excel-modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Upload and Send Emails</h2>
        <label htmlFor="subject-input">Subject:</label>
        <input
          type="text"
          id="subject-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter subject"
        />
          <label htmlFor="preview-input">Preview Text:</label>
        <input
          type="text"
          id="preview-input"
          value={previewtext}
          onChange={(e) => setPreviewtext(e.target.value)}
          placeholder="Enter Preview Text"
        />
        <div className="excel-modal-body">
          <h4>Sample excel format</h4>
          <img src={sampleexcel} alt="Sample Excel Format" className="sample-excel-image" />
          <h4>Upload excel file</h4>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          {fileName && <p>Uploaded File: {fileName}</p>}
          {excelData.length > 0 && (
            <button
              className="excel-modal-view-btn"
              onClick={() => {
                const table = document.getElementById("excel-table");
                table.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Uploaded List
            </button>
          )}
        </div>
        {excelData.length > 0 && (
          <div className="excel-table-container">
            <table id="excel-table">
              <thead>
                <tr>
                  {excelData[0].map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button className="excel-modal-send-btn" onClick={handleSend} disabled={isLoading}>
          {isLoading ? "Processing..." : "Send Mail"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ExcelModal;
