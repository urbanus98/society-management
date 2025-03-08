import html2pdf from "html2pdf.js";
import { formatDate } from "../components/misc";


export const generateInvoicePDF = (invoice: any, issuer: any, payer: any): void => {
  const element = document.createElement("div");
  element.style.padding = "40px";
  element.style.width = "190mm";
  element.style.boxSizing = "border-box";

  element.innerHTML = `
    <head>
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
        .text-center {
          text-align: center;
        }
        .pad-left {
          padding-left: 5px;
        }
        .mw300 {
          // min-width: 300px;
        }
        p {
          line-height: 1.8;
        }
      </style>
    </head>
    <div style="display: flex; justify-content: space-between;">
      <p><b>${issuer.name ? issuer.name.toUpperCase() : "ISSUER_NAME"}</b></p>
      <p><b>${issuer.iban ? issuer.iban.toUpperCase() : "ISSUER_IBAN"}</b></p>
    </div>
    <p>${issuer.address ?? "ISSUER_ADDRESS"}</p>
    <p>${issuer.postal ?? "ISSUER_POSTAL"} ${issuer.city ?? "ISSUER_CITY"}</p>
    <br />
    <br />
    <br />
    <div class="pad-left">
      <p>Datum: ${invoice.issue_date ? formatDate(invoice.issue_date) : "ISSUE_DATE"}</p>
      <br />
      <br />
      <p>${payer.name ?? "PAYER_NAME"}</p>
      <p>${payer.address ?? "PAYER_ADDRESS"}</p>
      <p>${payer.postal ?? ""} ${payer.city ?? "PAYER_POSTAL"}</p>
      <br />
      <h6><b>Račun št.: ${invoice.number ?? "INV.N."}-${invoice.issue_date ? invoice.issue_date.slice(0,4) : "INV.YEAR"}</b></h6>
    </div>
    <table>
      <tr>
        <th class="text-center">Naziv storitve</th>
        <th class="text-center">Znesek za plačilo</th>
      </tr>
      <tr style="height: 100px; border-bottom: 1px solid black; border-collapse: collapse;">
        <td>${invoice.service ?? "SERVICE_DESCRIPTION"}</td>
        <td class="text-center mw300">${invoice.amount ?? "SERVICE_AMOUNT"} &euro;</td>
      </tr>
      <tr>
        <td><b>Za plačilo</b></td>
        <td class="text-center"><b>${invoice.amount ?? "SUM_AMOUNT"} €</b></td>
      </tr>
    </table>
    <br />
    <p>DDV ni obračunan v skladu s 1. odstavkom 94. člena (ZDDV-1).</p>
    <br />
    <p>Znesek računa nakažite na TRR ${issuer.iban ?? "ISSUER_IBAN"} (${issuer.bank ?? "ISSUER_BANK"}) najkasneje en mesec od izdaje računa.</p>
    <br/>
    <br/>
    <div style="display:flex; justify-content: end;">
      <div style="display: flex; flex-direction: column;">
        <p>Predsednik društva: ${issuer.head ?? "ISSUER_HEAD"}</p>
        <img src="../../public/images/s1.png" alt="Podpis" style="width: 280px; height: 150px;"/>
      </div>
    </div>
  `;

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