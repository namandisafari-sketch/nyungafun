import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";

interface ReceiptPreviewProps {
  open: boolean;
  onClose: () => void;
  data: {
    receiptNo: string;
    date: string;
    studentName: string;
    level: string;
    classGrade: string | null;
    schoolName: string;
    parentName: string;
    parentPhone: string;
    paymentCode: string | null;
    isVerified: boolean;
    applicationFormFee: number;
    lawyerFormFee: number;
    totalFees: number;
    orgName: string;
    orgAddress: string;
    orgPhone: string;
    orgEmail: string;
    logoText: string;
    footerNote: string;
    signatureName: string;
    signatureTitle: string;
    seasonalRemark: string;
    qrData: string;
    appId: string;
  } | null;
}

const formatUGX = (amount: number) =>
  new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(amount);

const ReceiptPreview = ({ open, onClose, data }: ReceiptPreviewProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!data) return null;

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank", "width=350,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt ${data.receiptNo}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
          <style>
            @page { size: 80mm auto; margin: 0; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; width: 80mm; padding: 5mm 4mm; color: #1a1a2e; font-size: 10px; line-height: 1.5; background: #fff; }
            ${receiptStyles}
          </style>
        </head>
        <body onload="setTimeout(()=>{window.print(); window.close();}, 300);">
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-base font-display">Receipt Preview</DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-2">
          <div
            ref={receiptRef}
            className="bg-white text-[#1a1a2e] rounded-lg border shadow-sm mx-auto"
            style={{ width: "302px", fontFamily: "'Inter', sans-serif", fontSize: "10px", lineHeight: 1.5, padding: "16px 14px" }}
          >
            <ReceiptBody data={data} />
          </div>
        </div>

        <DialogFooter className="p-4 pt-2 flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="gap-1">
            <X className="h-4 w-4" /> Close
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-1">
            <Printer className="h-4 w-4" /> Print Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ReceiptBody = ({ data }: { data: NonNullable<ReceiptPreviewProps["data"]> }) => (
  <>
    {/* Watermark */}
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-30deg)", fontSize: "36px", fontWeight: 800, color: "rgba(26,26,46,0.03)", letterSpacing: "4px", pointerEvents: "none" }}>
      PAID
    </div>

    {/* Header */}
    <div style={{ textAlign: "center", paddingBottom: "8px", borderBottom: "2px solid #1a1a2e" }}>
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", background: "#1a1a2e", color: "#d4a843", fontFamily: "'JetBrains Mono', monospace", fontSize: "16px", fontWeight: 700, borderRadius: "8px", marginBottom: "4px", letterSpacing: "1px" }}>
        {data.logoText}
      </div>
      <div style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px" }}>{data.orgName}</div>
      <div style={{ fontSize: "8px", color: "#666", marginTop: "2px" }}>{data.orgAddress} • {data.orgPhone}</div>
      <div style={{ fontSize: "8px", color: "#666" }}>{data.orgEmail}</div>
    </div>

    {/* Seasonal Remark */}
    {data.seasonalRemark && (
      <div style={{ textAlign: "center", margin: "6px 0 2px", padding: "4px 8px", background: "linear-gradient(135deg, #fef3c7, #fde68a)", borderRadius: "4px", fontSize: "9px", fontWeight: 600, color: "#92400e", letterSpacing: "0.5px" }}>
        🎉 {data.seasonalRemark}
      </div>
    )}

    {/* Title */}
    <div style={{ textAlign: "center", margin: "8px 0 6px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "2px" }}>Payment Receipt</div>
    </div>

    {/* Meta */}
    <div style={{ display: "flex", justifyContent: "space-between", background: "#f5f5f0", borderRadius: "4px", padding: "5px 8px", marginBottom: "8px", fontSize: "9px" }}>
      <div><span style={{ color: "#888" }}>No:</span> <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>{data.receiptNo}</span></div>
      <div><span style={{ color: "#888" }}>Date:</span> <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>{data.date}</span></div>
    </div>

    {/* Student */}
    <Section title="Student Details">
      <InfoRow label="Name" value={data.studentName} />
      <InfoRow label="Level" value={data.level} />
      {data.classGrade && <InfoRow label="Class" value={data.classGrade} />}
      <InfoRow label="School" value={data.schoolName} />
    </Section>

    {/* Parent */}
    <Section title="Parent / Guardian">
      <InfoRow label="Name" value={data.parentName} />
      <InfoRow label="Phone" value={data.parentPhone} />
    </Section>

    {/* Fees */}
    <Section title="Payment Summary">
      <table style={{ width: "100%", borderCollapse: "collapse" as const, margin: "4px 0" }}>
        <tbody>
          <tr>
            <td style={{ padding: "3px 0", color: "#444" }}>Application Form Fee</td>
            <td style={{ padding: "3px 0", textAlign: "right" as const, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>{formatUGX(data.applicationFormFee)}</td>
          </tr>
          <tr>
            <td style={{ padding: "3px 0", color: "#444" }}>Lawyer / Legal Form Fee</td>
            <td style={{ padding: "3px 0", textAlign: "right" as const, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>{formatUGX(data.lawyerFormFee)}</td>
          </tr>
          <tr>
            <td style={{ paddingTop: "6px", borderTop: "2px solid #1a1a2e", fontSize: "12px", fontWeight: 700 }}>TOTAL PAID</td>
            <td style={{ paddingTop: "6px", borderTop: "2px solid #1a1a2e", fontSize: "12px", fontWeight: 700, textAlign: "right" as const, fontFamily: "'JetBrains Mono', monospace" }}>{formatUGX(data.totalFees)}</td>
          </tr>
        </tbody>
      </table>
    </Section>

    {/* Verified Badge */}
    <div style={{ textAlign: "center", margin: "8px 0" }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "4px",
        padding: "4px 14px", borderRadius: "20px", fontSize: "9px", fontWeight: 700,
        letterSpacing: "1px", textTransform: "uppercase" as const,
        ...(data.isVerified
          ? { background: "#e8f5e9", color: "#2e7d32", border: "1px solid #a5d6a7" }
          : { background: "#e3f2fd", color: "#1565c0", border: "1px solid #90caf9" })
      }}>
        {data.isVerified ? "✓ PAYMENT VERIFIED" : "✓ PAID"}
      </span>
      {data.paymentCode && (
        <div style={{ marginTop: "4px" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", background: "#f5f5f0", padding: "2px 10px", borderRadius: "4px" }}>
            {data.paymentCode}
          </span>
        </div>
      )}
    </div>

    {/* Stamp Area */}
    <div style={{ textAlign: "center", margin: "8px 0" }}>
      <div style={{
        display: "inline-block", width: "70px", height: "70px", border: "2px dashed #ccc",
        borderRadius: "50%", position: "relative" as const,
      }}>
        <div style={{
          position: "absolute" as const, top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-15deg)",
          fontSize: "8px", fontWeight: 700, color: "#2e7d32", textTransform: "uppercase" as const, letterSpacing: "1px",
          border: "2px solid #2e7d32", borderRadius: "50%", width: "60px", height: "60px",
          display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" as const, lineHeight: "1.1",
          opacity: data.isVerified ? 1 : 0.3,
        }}>
          {data.isVerified ? "VERIFIED" : "STAMP"}
        </div>
      </div>
      <div style={{ fontSize: "7px", color: "#999", marginTop: "2px" }}>Official Stamp</div>
    </div>

    {/* QR */}
    <div style={{ textAlign: "center", margin: "8px 0", padding: "8px 0", borderTop: "1px dashed #ccc", borderBottom: "1px dashed #ccc" }}>
      <QRCodeSVG value={data.qrData} size={90} level="M" />
      <div style={{ fontSize: "7px", color: "#999", marginTop: "4px", letterSpacing: "0.5px", textTransform: "uppercase" as const }}>Scan to verify payment</div>
    </div>

    {/* Footer */}
    <div style={{ textAlign: "center", marginTop: "6px" }}>
      <div style={{ fontSize: "7px", color: "#999", fontStyle: "italic", maxWidth: "90%", margin: "0 auto", lineHeight: 1.4 }}>{data.footerNote}</div>
    </div>

    {/* Signature */}
    <div style={{ textAlign: "right", marginTop: "12px" }}>
      <div style={{ width: "45%", marginLeft: "auto", borderTop: "1px solid #1a1a2e", paddingTop: "3px" }}>
        <div style={{ fontSize: "9px", fontWeight: 600 }}>{data.signatureName}</div>
        <div style={{ fontSize: "7px", color: "#888" }}>{data.signatureTitle}</div>
      </div>
    </div>
  </>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "8px" }}>
    <div style={{ fontSize: "8px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#999", marginBottom: "3px", paddingBottom: "2px", borderBottom: "1px solid #eee" }}>{title}</div>
    {children}
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: "10px" }}>
    <span style={{ color: "#666" }}>{label}</span>
    <span style={{ fontWeight: 600, textAlign: "right" as const, maxWidth: "55%" }}>{value}</span>
  </div>
);

const receiptStyles = `
  .header { text-align: center; padding-bottom: 10px; border-bottom: 2px solid #1a1a2e; }
  .logo { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #1a1a2e; color: #d4a843; font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; border-radius: 8px; margin-bottom: 6px; letter-spacing: 1px; }
`;

export default ReceiptPreview;
