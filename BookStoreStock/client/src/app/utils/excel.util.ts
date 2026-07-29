import * as ExcelJS from 'exceljs';

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
  style?: Partial<ExcelJS.Style>;
}

export async function downloadExcelFile(
  filename: string,
  sheetName: string,
  columns: ExcelColumn[],
  data: any[]
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = columns.map(col => ({
    header: col.header,
    key: col.key,
    width: col.width || 15,
    style: col.style
  }));

  // Add Data
  worksheet.addRows(data);

  // Apply Styles
  // 1. Header Row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F9C8E' } // Using accent color of the app if possible, or a nice teal
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

  // 2. Borders for all cells
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };
      if (rowNumber > 1) {
        cell.alignment = { vertical: 'middle' };
      }
    });
    // Adjust row height slightly for better visual
    row.height = rowNumber === 1 ? 25 : 20;
  });

  // Export
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadExcelFileFromRows(
  filename: string,
  sheetName: string,
  rows: any[][]
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.addRows(rows);

  // Apply basic styles based on common patterns
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      // Add borders everywhere
      if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        };
      }
      
      // If it's a known header row (e.g. row 1 and row 7 in reports)
      if (
        (rowNumber === 1 && String(cell.value) === 'Métrica') ||
        (String(row.getCell(1).value) === 'ID' && String(cell.value) !== '') ||
        (rowNumber === 1)
      ) {
        // Just format it as header if it looks like one, or we can just explicitly style rows 1 and 7 (hardcoded for simplicity in this utility)
        if (rowNumber === 1 || String(row.getCell(1).value) === 'ID') {
           cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
           cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'FF0F9C8E' }
           };
           cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      }
    });
  });

  // Export
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
