import { formatDate } from "../../components/misc";

export const proformaHTML = (proforma: any, issuer: any, payer: any) => {
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
          line-height: 1.6;
        }
        h6 {
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
    <div>
      <p>${issuer?.name ?? "ISSUER_NAME"}</p>
      <p>${issuer?.address ?? "ISSUER_ADDR"} ${issuer.postal}, ${
    issuer.city
  }</p>
      <p>Davčna številka: ${issuer?.tin ?? "ISSUER_TIN"}</p>
      <p>Matična številka: ${issuer?.registry ?? "ISSUER_REG"}</p>
      <p>Predsednik društva: ${issuer?.head ?? "ISSUER_HEAD"}</p>
      <p>${issuer.short} ni zavezanec za DDV.</p>
    </div>
    <br />
    <p>Datum in kraj: ${issuer?.city ?? "ISSUER_ADDRESS"}, ${formatDate(
    proforma.issueDate
  )}</p>
      <br />
      <p>Naročnik:</p>
      <p>${payer?.name ?? "PAYER_NAME"}</p>
      <p>${payer?.address ?? "PAYER_ADDRESS"}, ${payer?.postal ?? ""} ${
    payer?.city ?? "PAYER_POSTAL"
  }</p>
      <p>Davčna številka: ${payer.tin ?? ""}</p>
      <br />
      <br />
      <h6><b>Zadeva: ${proforma.name}</b></h6>
      <br />
      <br />
      <h6>Številka ponudbe: ${proforma.number ?? "N."}/${
    proforma.issueDate ? proforma.issueDate.slice(0, 4) : "YEAR"
  }</h6>
    <table>
      <tr>
        <th class="text-center">Predmet</th>
        <th class="text-center">Cena</th>
      </tr>
      <tr style="height: 80px; border-bottom: 1px solid black; border-collapse: collapse;">
        <td>${proforma.name ?? "SERVICE_DESCRIPTION"}</td>
        <td class="text-center mw300">${
          proforma.amount ?? "SERVICE_AMOUNT"
        } &euro;</td>
      </tr>
      <tr>
        <td>Skupaj</td>
        <td class="text-center"><b>${proforma.amount ?? "SUM_AMOUNT"} €</b></td>
      </tr>
    </table>
    <div class="pad-left">
      <p>Datum storitve: ${formatDate(proforma.serviceDate)}</p>
    </div>
    <br />
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
