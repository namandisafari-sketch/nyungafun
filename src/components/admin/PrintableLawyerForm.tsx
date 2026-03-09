import { useRef } from "react";
import lawyerStampImg from "@/assets/lawyer-stamp.png";
import nyungaLogo from "@/assets/nyunga-official-logo.png";

interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "select" | "checkbox";
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface FormTemplate {
  id: string;
  title: string;
  description: string | null;
  fields: FormField[];
  is_active: boolean;
}

interface Props {
  template: FormTemplate;
  responses: Record<string, any>;
  signatureUrl: string | null;
  submittedAt: string;
}

const PrintableLawyerForm = ({ template, responses, signatureUrl, submittedAt }: Props) => {
  return (
    <div className="print-lawyer-form" style={{ fontFamily: "Times New Roman, serif", color: "#000", background: "#fff", padding: "40px 50px", maxWidth: "210mm", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img src={nyungaLogo} alt="Nyunga Foundation" style={{ height: 60, marginBottom: 8 }} />
        <h2 style={{ fontSize: 16, fontWeight: "bold", margin: "4px 0", textTransform: "uppercase" }}>
          NYUNGA FOUNDATION
        </h2>
        <p style={{ fontSize: 11, margin: 0, fontStyle: "italic" }}>
          "Empowering Communities Through Education"
        </p>
      </div>

      <hr style={{ border: "1px solid #000", margin: "12px 0" }} />

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: "bold", textTransform: "uppercase", textDecoration: "underline", margin: "8px 0" }}>
          {template.title}
        </h3>
        {template.description && (
          <p style={{ fontSize: 10, fontStyle: "italic", margin: "4px 0", maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
            {template.description}
          </p>
        )}
      </div>

      {/* Form fields */}
      <div style={{ marginTop: 16 }}>
        {(template.fields || []).map((field) => (
          <div key={field.id} style={{ marginBottom: 12 }}>
            {field.type === "checkbox" ? (
              <div style={{ fontSize: 11, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14, lineHeight: 1 }}>{responses[field.id] ? "☑" : "☐"}</span>
                <span>{field.label}</span>
              </div>
            ) : (
              <div style={{ fontSize: 11 }}>
                <span style={{ fontWeight: "bold" }}>{field.label}: </span>
                <span style={{ borderBottom: "1px dotted #000", paddingBottom: 1, minWidth: 200, display: "inline-block" }}>
                  {responses[field.id] || "______________________"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Signature section */}
      <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: "bold", marginBottom: 8 }}>Parent / Guardian Signature:</p>
          {signatureUrl ? (
            <img src={signatureUrl} alt="Signature" style={{ height: 50, border: "1px solid #ccc", borderRadius: 4, padding: 4, background: "#fff" }} />
          ) : (
            <div style={{ borderBottom: "1px solid #000", width: 200, height: 40 }} />
          )}
          <p style={{ fontSize: 10, marginTop: 4 }}>
            Date: {new Date(submittedAt).toLocaleDateString("en-UG", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Lawyer stamp */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: "bold", marginBottom: 8 }}>Certified by Advocate:</p>
          <img src={lawyerStampImg} alt="Advocate Stamp" style={{ height: 70, opacity: 0.9, transform: "rotate(-5deg)" }} />
          <p style={{ fontSize: 9, marginTop: 4 }}>Advocate Lubwama Ezra Tonny</p>
          <p style={{ fontSize: 9 }}>ezratonny85@gmail.com</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 30, borderTop: "1px solid #000", paddingTop: 8, textAlign: "center" }}>
        <p style={{ fontSize: 9, color: "#555" }}>
          This document was generated electronically by Nyunga Foundation Bursary Management System. 
          Submitted on {new Date(submittedAt).toLocaleDateString("en-UG", { day: "numeric", month: "long", year: "numeric" })}.
        </p>
      </div>
    </div>
  );
};

export default PrintableLawyerForm;
