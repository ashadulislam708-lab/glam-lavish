import { formatDate } from "~/utils/formatting";
import type { InvoiceData } from "~/types/order";

interface PackingInvoiceTemplateProps {
  invoice: InvoiceData;
}

const formatTK = (amount: number | null | undefined): string => {
  if (amount == null) return "0 TK";
  return `${amount.toLocaleString("en-IN")} TK`;
};

export default function PackingInvoiceTemplate({
  invoice,
}: PackingInvoiceTemplateProps) {
  return (
    <div
      className="bg-white text-black"
      style={{
        fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
        width: "148mm",
        minHeight: "210mm",
        padding: "10mm",
        fontSize: "12px",
        lineHeight: "1.3",
        boxSizing: "border-box",
      }}
    >
      {/* ── Header Row: Logo (left) + INVOICE heading (right) ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "5mm",
        }}
      >
        {/* Left: Logo only */}
        <div style={{ flex: 1 }}>
          <img
            src="/logo.png"
            alt="Glam Lavish"
            style={{
              maxWidth: "50mm",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        {/* Right: INVOICE heading */}
        <div style={{ textAlign: "right", flex: 1 }}>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              margin: 0,
              letterSpacing: "1px",
              lineHeight: 1,
              color: "#4f46e5",
            }}
          >
            INVOICE
          </h1>
        </div>
      </div>

      {/* ── Info Row: Invoice To (left) + Invoice details (right) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: "5mm",
        }}
      >
        {/* Left: Invoice To */}
        <div style={{ flex: 1, minWidth: 0, wordBreak: "break-word", paddingRight: "3mm" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              lineHeight: 1.4,
            }}
          >
            Invoice To
          </div>
          <div style={{ fontSize: "12px", marginBottom: "1px", wordBreak: "break-word" }}>
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", verticalAlign: "baseline", marginRight: "3px" }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {invoice.customerName}
          </div>
          <div style={{ fontSize: "12px", marginBottom: "1px", wordBreak: "break-word" }}>
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", verticalAlign: "baseline", marginRight: "3px" }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            {invoice.customerPhone}
          </div>
          <div style={{ fontSize: "12px", lineHeight: 1.4, wordBreak: "break-word", overflowWrap: "break-word" }}>
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", verticalAlign: "baseline", marginRight: "3px" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {[invoice.customerAddress, invoice.upazila, invoice.district].filter(Boolean).join(", ")}
          </div>
        </div>

        {/* Right: Invoice details */}
        <div style={{ fontSize: "12px", lineHeight: "1.4", whiteSpace: "nowrap", textAlign: "left" }}>
          <div>
            <span style={{ fontWeight: "bold" }}>Invoice No:</span>{" "}
            {invoice.invoiceId}
          </div>
          <div>
            <span style={{ fontWeight: "bold" }}>Date:</span>{" "}
            {formatDate(invoice.date)}
          </div>
          <div>
            <span style={{ fontWeight: "bold" }}>Courier:</span>{" "}
            {invoice.courierName || "-"}
          </div>
          <div>
            <span style={{ fontWeight: "bold" }}>Delivery ID:</span>{" "}
            {invoice.deliveryId || "-"}
          </div>
        </div>
      </div>

      {/* ── Products Table ── */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          borderTop: "2px solid #000",
          borderBottom: "2px solid #000",
          marginBottom: "5mm",
          fontSize: "12px",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #000" }}>
            <th style={{ padding: "2mm 1mm", textAlign: "center", width: "5%", fontWeight: "bold" }}>#</th>
            <th style={{ padding: "2mm 1mm", textAlign: "left", width: "32%", fontWeight: "bold" }}>Product</th>
            <th style={{ padding: "2mm 1mm", textAlign: "center", width: "18%", fontWeight: "bold" }}>Color/Size</th>
            <th style={{ padding: "2mm 1mm", textAlign: "center", width: "10%", fontWeight: "bold" }}>Qty</th>
            <th style={{ padding: "2mm 1mm", textAlign: "right", width: "15%", fontWeight: "bold" }}>Price</th>
            <th style={{ padding: "2mm 1mm", textAlign: "right", width: "20%", fontWeight: "bold" }}>Item Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr
              key={idx}
              style={{
                borderBottom:
                  idx < invoice.items.length - 1 ? "1px solid #ddd" : "none",
              }}
            >
              <td style={{ padding: "1.5mm 1mm", textAlign: "center" }}>{idx + 1}</td>
              <td style={{ padding: "1.5mm 1mm", textAlign: "left" }}>{item.name}</td>
              <td style={{ padding: "1.5mm 1mm", textAlign: "center", maxWidth: "30mm", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.variation || "-"}
              </td>
              <td style={{ padding: "1.5mm 1mm", textAlign: "center" }}>{item.quantity}</td>
              <td style={{ padding: "1.5mm 1mm", textAlign: "right" }}>{item.price.toLocaleString("en-IN")}</td>
              <td style={{ padding: "1.5mm 1mm", textAlign: "right" }}>{(item.price * item.quantity).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Payment Fields (right-aligned) ── */}
      <div style={{
        marginBottom: "5mm",
        fontSize: "12px",
        lineHeight: "1.6",
        paddingLeft: "50%",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Sub Total:</span>
          <span style={{ minWidth: "30mm", textAlign: "right" }}>{formatTK(invoice.subtotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Discount:</span>
          <span style={{ minWidth: "30mm", textAlign: "right" }}>{formatTK(invoice.discountAmount)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Delivery Charge:</span>
          <span style={{ minWidth: "30mm", textAlign: "right" }}>{formatTK(invoice.shippingFee)}</span>
        </div>
        <div style={{ borderTop: "1px solid #000", margin: "1mm 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "12px" }}>
          <span>Grand Total:</span>
          <span style={{ minWidth: "30mm", textAlign: "right" }}>{formatTK(invoice.grandTotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Advance Payment:</span>
          <span style={{ minWidth: "30mm", textAlign: "right" }}>{formatTK(invoice.advanceAmount)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "12px" }}>
          <span>Due Amount:</span>
          <span style={{ minWidth: "30mm", textAlign: "right" }}>{formatTK(invoice.dueAmount)}</span>
        </div>
      </div>

      {/* ── Company Signature (right-aligned) ── */}
      <div style={{
        textAlign: "right",
        marginTop: "15mm",
        marginBottom: "5mm",
        fontSize: "12px",
        paddingLeft: "50%",
      }}>
        <div style={{ borderTop: "1px solid #000", display: "inline-block", minWidth: "35mm", paddingTop: "1mm" }}>
          Company Signature
        </div>
      </div>

      {/* ── Footer (centered) ── */}
      <div
        style={{
          textAlign: "center",
          fontSize: "12px",
          borderTop: "1px solid #ccc",
          paddingTop: "3mm",
        }}
      >
        www.glamlavish.com &nbsp;|&nbsp; 09678-770181
      </div>
    </div>
  );
}
