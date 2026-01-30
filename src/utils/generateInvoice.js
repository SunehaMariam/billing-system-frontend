import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (data) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("INVOICE", 14, 22);

  doc.setFontSize(12);
  doc.text(`Bill No: ${data.billNo}`, 14, 32);
  doc.text(`Customer: ${data.customer || "N/A"}`, 14, 40);
  doc.text(`Payment Method: ${data.paymentMethod}`, 14, 48);

  const tableColumn = ["Item", "Price", "Qty", "Total"];
  const tableRows = [];

  data.items.forEach((item) => {
    const row = [
      item.name,
      `Rs ${item.price}`,
      item.qty,
      `Rs ${item.price * item.qty}`,
    ];
    tableRows.push(row);
  });

  // IMPORTANT: use autoTable(doc, {...}) not doc.autoTable(...)
  autoTable(doc, {
    startY: 60,
    head: [tableColumn],
    body: tableRows,
  });

  doc.text(`Total: Rs ${data.totalAmount}`, 14, doc.lastAutoTable.finalY + 10);
  doc.text(`Paid: Rs ${data.paidAmount}`, 14, doc.lastAutoTable.finalY + 18);
  doc.text(`Change: Rs ${data.changeReturn}`, 14, doc.lastAutoTable.finalY + 26);

  doc.save(`Invoice_${data.billNo}.pdf`);
};
