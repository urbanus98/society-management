import html2pdf from "html2pdf.js";
import { invoiceHTML } from "./html/invoiceHTML";
import { proformaHTML } from "./html/proformaHTML";


export const generatePDF = (invoice: any, issuer: any, payer: any, type: any): void => {
  const element = document.createElement("div");
  element.style.padding = "40px";
  element.style.width = "190mm";
  element.style.boxSizing = "border-box";

  switch (type){
    case "invoice": {
      element.innerHTML = invoiceHTML(invoice, issuer, payer);
      break;
    }
    case "proforma": {
      element.innerHTML = proformaHTML(invoice, issuer, payer);
      break;
    }
  }
  // console.log("Generated HTML:", element.innerHTML);

  const opt = {
    margin: 10,
    filename: `Invoice-${invoice.number}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 4 },
    jsPDF: { format: "a4", orientation: "portrait", unit: "mm" },
  };

  html2pdf()
    .from(element)
    .set(opt)
    .output("blob")
    .then((pdfBlob: Blob) => {
      const pdfBlobUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfBlobUrl, "_blank");
    })
    .catch((err: any) => {
      console.error("Error generating PDF:", err);
    })
    .finally(() => {
      element.remove();
    });
};