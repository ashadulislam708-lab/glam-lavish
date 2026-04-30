import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router";
import { orderService } from "~/services/httpServices/orderService";
import { Button } from "~/components/ui/button";
import LoadingSpinner from "~/components/atoms/LoadingSpinner";
import PackingInvoiceTemplate from "~/components/shared/PackingInvoiceTemplate";
import { ArrowLeft, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import type { InvoiceData } from "~/types/order";

export default function PackingInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      orderService
        .getInvoiceData(id)
        .then(setInvoice)
        .catch(() => setInvoice(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: invoice?.invoiceId
      ? `Packing-Invoice-${invoice.invoiceId}`
      : "Packing-Invoice",
  });

  const onPrintClick = useCallback(() => {
    handlePrint();
  }, [handlePrint]);

  if (loading) {
    return <LoadingSpinner className="h-64" text="Loading packing invoice..." />;
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Invoice data not found</p>
        <Link to="/orders" className="text-primary hover:underline mt-2 block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls - hidden in print */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link to={`/orders/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Packing Invoice</h1>
        </div>
        <Button onClick={onPrintClick}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            size: A5;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden;
          }
          #packing-invoice-print, #packing-invoice-print * {
            visibility: visible !important;
          }
          #packing-invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>

      {/* Invoice preview */}
      <div className="mx-auto shadow-lg" style={{ width: "148mm" }}>
        <div ref={printRef} id="packing-invoice-print">
          <PackingInvoiceTemplate invoice={invoice} />
        </div>
      </div>
    </div>
  );
}
