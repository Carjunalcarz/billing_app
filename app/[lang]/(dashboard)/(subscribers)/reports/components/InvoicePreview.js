"use client";
import React, { useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";

const InvoicePreview = () => {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    // 📌 Mock invoice data (Replace with API call)
    setInvoice({
      id: "INV-001",
      date: "2025-02-19",
      customer: "John Doe",
      items: [
        { name: "Product A", quantity: 2, price: 50 },
        { name: "Product B", quantity: 1, price: 75 },
        { name: "Product C", quantity: 3, price: 30 },
      ],
    });
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" , padding : "20px" }}>
      {invoice ? (
        <PDFViewer width="100%" height="100%">
          <InvoicePDF invoice={invoice} />
        </PDFViewer>
      ) : (
        <p>Loading invoice...</p>
      )}
    </div>
  );
};

export default InvoicePreview;
