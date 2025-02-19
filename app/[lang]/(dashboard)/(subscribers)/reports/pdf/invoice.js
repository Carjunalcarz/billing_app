import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../components/InvoicePDF";

export default function InvoicePage() {
  // Sample Invoice Data
  const [invoice] = useState({
    id: "INV-2024-001",
    date: "2025-02-19",
    customer: "John Doe",
    items: [
      { name: "Product A", quantity: 2, price: 50 },
      { name: "Product B", quantity: 1, price: 100 },
      { name: "Product C", quantity: 3, price: 30 },
    ],
  });

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Invoice Page</h1>
      <PDFDownloadLink document={<InvoicePDF invoice={invoice} />} fileName="invoice.pdf">
        {({ loading }) => (loading ? "Generating PDF..." : "Download Invoice PDF")}
      </PDFDownloadLink>
    </div>
  );
}
