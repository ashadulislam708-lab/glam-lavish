import { formatDate } from "~/utils/formatting";
import type { InvoiceData } from "~/types/order";

interface InvoiceTemplateProps {
  invoice: InvoiceData;
  showQrCode: boolean;
  pageBreak?: boolean;
}

export default function InvoiceTemplate({
  invoice,
  showQrCode,
  pageBreak = false,
}: InvoiceTemplateProps) {
  return (
    <div
      className="bg-white"
      style={{
        fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
        width: "3in",
        minHeight: "4in",
        fontSize: "11px",
        lineHeight: "1.3",
        color: "#000",
        padding: "6px",
        pageBreakBefore: pageBreak ? "always" : undefined,
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        <img
          src="/logo.png"
          alt="Glam Lavish"
          style={{
            maxWidth: "1.6in",
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
        />
        <div style={{ fontSize: "8px", marginTop: "2px", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", gap: "3px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          www.glamlavish.com
          <span style={{ margin: "0 2px" }}>|</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          09678-770181
        </div>
      </div>

      {/* Invoice Metadata */}
      <div
        style={{
          borderBottom: "1px dashed #ccc",
          padding: "4px 0",
          marginBottom: "6px",
        }}
      >
        <div>
          <span style={{ fontWeight: "bold" }}>Invoice No:</span>{" "}
          {invoice.invoiceId}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Invoice Date:</span>{" "}
          {formatDate(invoice.date)}
        </div>
        {invoice.courierName && (
          <div>
            <span style={{ fontWeight: "bold" }}>Courier:</span>{" "}
            {invoice.courierName}
          </div>
        )}
        <div>
          <span style={{ fontWeight: "bold" }}>Delivery ID:</span>{" "}
          {invoice.deliveryId || "-"}
        </div>
      </div>

      {/* Invoice To */}
      <div
        style={{
          paddingBottom: "4px",
          marginBottom: "6px",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            marginBottom: "2px",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Invoice To
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {invoice.customerName}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          {invoice.customerPhone}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "3px", fontSize: "10px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {invoice.customerAddress}
        </div>
      </div>

      {/* Items Table */}
      <div
        style={{
          borderTop: "1px solid #000",
          paddingBottom: "4px",
          marginBottom: "6px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "10px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #000" }}>
              <th
                style={{
                  textAlign: "left",
                  paddingBottom: "2px",
                  paddingTop: "2px",
                  width: "35%",
                  fontWeight: "bold",
                }}
              >
                Product
              </th>
              <th
                style={{
                  textAlign: "center",
                  paddingBottom: "2px",
                  paddingTop: "2px",
                  width: "18%",
                  fontWeight: "bold",
                }}
              >
                Color/Size
              </th>
              <th
                style={{
                  textAlign: "center",
                  paddingBottom: "2px",
                  paddingTop: "2px",
                  width: "12%",
                  fontWeight: "bold",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  textAlign: "center",
                  paddingBottom: "2px",
                  paddingTop: "2px",
                  width: "15%",
                  fontWeight: "bold",
                }}
              >
                Price
              </th>
              <th
                style={{
                  textAlign: "right",
                  paddingBottom: "2px",
                  paddingTop: "2px",
                  width: "20%",
                  fontWeight: "bold",
                }}
              >
                Item Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom:
                    idx < invoice.items.length - 1
                      ? "1px dashed #ddd"
                      : "none",
                }}
              >
                <td
                  style={{
                    textAlign: "left",
                    padding: "2px 0",
                    maxWidth: "100px",
                    wordBreak: "break-word",
                  }}
                >
                  {item.name}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "2px 0",
                    maxWidth: "55px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.variation || "-"}
                </td>
                <td style={{ textAlign: "center", padding: "2px 0" }}>
                  {item.quantity}
                </td>
                <td style={{ textAlign: "center", padding: "2px 0" }}>
                  {item.price}
                </td>
                <td style={{ textAlign: "right", padding: "2px 0" }}>
                  {item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div
        style={{
          borderBottom:
            showQrCode && invoice.qrCodeDataUrl
              ? "1px dashed #000"
              : "none",
          paddingBottom: "4px",
          marginBottom: "6px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Sub Total:</span>
          <span>{invoice.subtotal} TK</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Discount:</span>
          <span>{invoice.discountAmount ?? 0} TK</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Delivery Charge:</span>
          <span>{invoice.shippingFee} TK</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "2px",
          }}
        >
          <span>Grand Total:</span>
          <span>{invoice.grandTotal} TK</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Advance Payment:</span>
          <span>{invoice.advanceAmount ?? 0} TK</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Due Amount:</span>
          <span>{invoice.dueAmount} TK</span>
        </div>
      </div>

      {/* QR Code */}
      {showQrCode && invoice.qrCodeDataUrl && (
        <div style={{ textAlign: "center", marginBottom: "4px" }}>
          <img
            src={invoice.qrCodeDataUrl}
            alt="Track Order"
            style={{ width: "60px", height: "60px", margin: "0 auto" }}
          />
          <div style={{ fontSize: "8px", marginTop: "2px" }}>
            Scan to track your order
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          fontSize: "8px",
          paddingTop: "4px",
        }}
      >
        Thank you for shopping with Glam Lavish!
      </div>
    </div>
  );
}
