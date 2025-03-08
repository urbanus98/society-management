
declare module 'html2pdf.js' {
    interface Html2PdfOptions {
      margin?: number | [number, number, number, number];
      filename?: string;
      image?: { type: string; quality: number };
      html2canvas?: any;
      jsPDF?: { orientation: string; unit: string; format: string };
    }
    // declare module "html2pdf.js" {
    interface Html2PdfInstance {
        from(element: HTMLElement): Html2PdfInstance;
        set(options: any): Html2PdfInstance;
        output(type: "blob"): Promise<Blob>;
        then(callback: (pdf: any) => void): Html2PdfInstance;
    }
    function html2pdf(): Html2PdfInstance;
        export default html2pdf;
    }
    // interface Html2PdfInstance {
    //   from(element: HTMLElement | string): this;
    //   set(options: Html2PdfOptions): this;
    //   toPdf(): this;
    //   save(filename?: string): Promise<void>;
    //   outputPdf(): Promise<Blob>;
    // }
  
    // function html2pdf(): Html2PdfInstance;
  
    // export default html2pdf;
    // }   
  