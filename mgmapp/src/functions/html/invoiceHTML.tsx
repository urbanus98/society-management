import { formatDate } from "../../components/misc";

export const invoiceHTML = (invoice: any, issuer: any, payer: any) => {
  return `
    <html>
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
    <body>
    <div style="display: flex; justify-content: space-between;">
      <p><b>${issuer?.name ? issuer?.name.toUpperCase() : "ISSUER_NAME"}</b></p>
      <p><b>${issuer?.iban ? issuer?.iban.toUpperCase() : "ISSUER_IBAN"}</b></p>
    </div>
    <p>${issuer?.address ?? "ISSUER_ADDRESS"}</p>
    <p>${issuer?.postal ?? "ISSUER_POSTAL"} ${issuer?.city ?? "ISSUER_CITY"}</p>
    <br />
    <br />
    <div class="pad-left">
      <p>Datum: ${
        invoice?.issueDate ? formatDate(invoice.issueDate) : "ISSUE_DATE"
      }</p>
      <br />
      <br />
      <p>${payer?.name ?? "PAYER_NAME"}</p>
      <p>${payer?.address ?? "PAYER_ADDRESS"}</p>
      <p>${payer?.postal ?? ""} ${payer?.city ?? "PAYER_POSTAL"}</p>
      <br />
      <h6><b>Račun št.: ${invoice.invoiceNumber ?? "N."}-${
    invoice.issueDate ? invoice.issueDate.slice(0, 4) : "YEAR"
  }</b></h6>
    </div>
    <table>
      <tr>
        <th class="text-center">Naziv storitve</th>
        <th class="text-center">Znesek za plačilo</th>
      </tr>
      <tr style="height: 80px; border-bottom: 1px solid black; border-collapse: collapse;">
        <td>${invoice.name ?? "SERVICE_DESCRIPTION"}</td>
        <td class="text-center mw300">${
          invoice.amount ?? "SERVICE_AMOUNT"
        } &euro;</td>
      </tr>
      <tr>
        <td><b>Za plačilo</b></td>
        <td class="text-center"><b>${invoice.amount ?? "SUM_AMOUNT"} €</b></td>
      </tr>
    </table>
    <div class="pad-left">
      <p>Datum opravljene storitve: ${formatDate(invoice.serviceDate)}</p>
    </div>
    <br />
    <p>DDV ni obračunan v skladu s 1. odstavkom 94. člena (ZDDV-1).</p>
    <br />
    <p>Znesek računa nakažite na TRR ${issuer?.iban ?? "ISSUER_IBAN"} (${
    issuer?.bank ?? "ISSUER_BANK"
  }) najkasneje en mesec od izdaje računa.</p>
    <br/>
    <div style="display:flex; justify-content: end;">
      <div style="display: flex; flex-direction: column;">
        <p>Predsednik društva: ${issuer?.head ?? "ISSUER_HEAD"}</p>
        <img src="../../public/images/s1.png" alt="Podpis" style="width: 280px; height: 150px;"/>
      </div>
    </div>
    </body>
    </html>
  `;
};
