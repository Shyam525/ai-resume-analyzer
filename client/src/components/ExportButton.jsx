export default function ExportButton({ targetId, onNotify }) {
  async function handleExport() {
    const target = document.getElementById(targetId);

    if (!target) {
      onNotify("error", "We could not find the report to export.");
      return;
    }

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(target, {
        scale: 2,
        backgroundColor: "#0A0F1E",
        useCORS: true,
      });

      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = pageWidth;
      const imageHeight = (canvas.height * pageWidth) / canvas.width;
      let remainingHeight = imageHeight;
      let position = 0;

      pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight);
      remainingHeight -= pageHeight;

      while (remainingHeight > 0) {
        position = remainingHeight - imageHeight;
        pdf.addPage();
        pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight);
        remainingHeight -= pageHeight;
      }

      pdf.save(`resume-analysis-${Date.now()}.pdf`);
      onNotify("success", "PDF report downloaded.");
    } catch {
      onNotify("error", "Export failed. Please try again.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center justify-center rounded-full border border-cyan/20 bg-cyan/10 px-5 py-3 text-sm font-medium text-cyan transition hover:bg-cyan/15"
    >
      Download Full Report (PDF)
    </button>
  );
}
