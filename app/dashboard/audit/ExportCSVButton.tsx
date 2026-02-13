"use client";

interface ExportFilters {
  [key: string]: string | number | boolean | undefined;
}

export default function ExportCSVButton({ filters }: { filters: ExportFilters }) {
  async function exportCSV() {
    const res = await fetch("/api/audit/export", {
      method: "POST",
      body: JSON.stringify(filters),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-log.csv";
    a.click();
  }

  return (
    <button
      onClick={exportCSV}
      className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded"
    >
      Exportar CSV
    </button>
  );
}
