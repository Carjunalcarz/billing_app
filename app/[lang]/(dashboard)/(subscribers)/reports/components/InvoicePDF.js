import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1 },
  row: { flexDirection: "row" },
  cell: { padding: 5, borderStyle: "solid", borderWidth: 1, width: "25%" },
});

// Invoice Component
const InvoicePDF = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Invoice #{invoice.id}</Text>
        <Text>Date: {invoice.date}</Text>
        <Text>Customer: {invoice.customer}</Text>
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.row, { backgroundColor: "#f0f0f0" }]}>
          <Text style={styles.cell}>Item</Text>
          <Text style={styles.cell}>Quantity</Text>
          <Text style={styles.cell}>Price</Text>
          <Text style={styles.cell}>Total</Text>
        </View>

        {/* Table Rows */}
        {invoice.items.map((item, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>${item.price}</Text>
            <Text style={styles.cell}>${item.quantity * item.price}</Text>
          </View>
        ))}
      </View>

      {/* Total Amount */}
      <View style={styles.section}>
        <Text>Total: ${invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0)}</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
