// Client-side export helpers for the admin dashboard. No server calls — the
// dashboard already holds the rows in memory. PDF deps are dynamically imported
// so they stay out of the initial admin bundle.

export interface ExportColumn<T> {
  header: string;
  value: (row: T) => string;
}

function csvEscape(value: string): string {
  // Quote if the value contains a comma, quote, or newline; double up quotes.
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildCsv<T>(columns: ExportColumn<T>[], rows: T[]): string {
  const header = columns.map((c) => csvEscape(c.header)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => csvEscape(c.value(row) ?? "")).join(",")
  );
  return [header, ...lines].join("\r\n");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportCsv<T>(
  filename: string,
  columns: ExportColumn<T>[],
  rows: T[]
) {
  // Prepend a UTF-8 BOM so Excel opens accented characters correctly.
  const csv = "﻿" + buildCsv(columns, rows);
  triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8;" }), filename);
}

export async function exportPdf<T>(
  title: string,
  filename: string,
  columns: ExportColumn<T>[],
  rows: T[]
) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFontSize(14);
  doc.setTextColor(26, 46, 64); // primary navy
  doc.text("UpliftGrove Foundation", 14, 15);
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(`${title} — exported ${new Date().toLocaleString()}`, 14, 21);

  autoTable(doc, {
    startY: 26,
    head: [columns.map((c) => c.header)],
    body: rows.map((row) => columns.map((c) => c.value(row) ?? "")),
    styles: { fontSize: 8, cellPadding: 2, overflow: "linebreak", valign: "top" },
    headStyles: { fillColor: [26, 46, 64], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [249, 248, 246] },
    margin: { left: 14, right: 14 },
  });

  doc.save(filename);
}

export function exportFilename(base: string, ext: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `upliftgrove-${base}-${date}.${ext}`;
}
