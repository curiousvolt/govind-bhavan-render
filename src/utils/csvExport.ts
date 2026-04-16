import { saveAs } from 'file-saver';

// Fields to exclude from CSV output (internal/DB fields)
const EXCLUDED_KEYS = new Set(['_id', '__v', 'id', 'studentId', 'registeredStudentDetails', 'registeredStudents']);

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.join('; ');
  if (typeof value === 'object') {
    try { return JSON.stringify(value); } catch { return ''; }
  }
  return String(value);
}

export const exportToCSV = (data: any[], filename: string) => {
  try {
    if (!data || !data.length) {
      alert('No data to export.');
      return;
    }

    const headers = Object.keys(data[0]).filter(k => !EXCLUDED_KEYS.has(k));

    const rows = data.map(row =>
      headers.map(h => {
        const escaped = formatValue(row[h]).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    );

    const csvString = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${filename}.csv`);
  } catch (err) {
    console.error('CSV Export failed:', err);
    alert('Failed to export CSV. Check console for details.');
  }
};
