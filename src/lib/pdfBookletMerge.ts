import { PDFDocument } from "pdf-lib";

/**
 * Booklet reorder: Scanner produces two files for one application booklet.
 * File A (Outer): Physical pages 1 & 4
 * File B (Inner): Physical pages 2 & 3
 * Goal: Merge into correct reading order → Page 1, Page 2, Page 3, Page 4
 *
 * Each file may be:
 *   - A 2-page PDF (extract by index)
 *   - A single wide A3 landscape page (split down the middle)
 */

async function extractTwoPages(pdfBytes: Uint8Array): Promise<PDFDocument> {
  const srcDoc = await PDFDocument.load(pdfBytes);
  const pageCount = srcDoc.getPageCount();

  if (pageCount >= 2) {
    // Already has 2+ pages — return as-is (we'll copy pages by index)
    return srcDoc;
  }

  // Single page — split down the middle (A3 landscape → two A4 pages)
  const srcPage = srcDoc.getPage(0);
  const { width, height } = srcPage.getSize();
  const halfWidth = width / 2;

  const splitDoc = await PDFDocument.create();

  // Left half → first page
  const [leftEmbed] = await splitDoc.embedPages([srcPage], [
    { left: 0, bottom: 0, right: halfWidth, top: height },
  ]);
  const leftPage = splitDoc.addPage([halfWidth, height]);
  leftPage.drawPage(leftEmbed, { x: 0, y: 0, width: halfWidth, height });

  // Right half → second page
  const [rightEmbed] = await splitDoc.embedPages([srcPage], [
    { left: halfWidth, bottom: 0, right: width, top: height },
  ]);
  const rightPage = splitDoc.addPage([halfWidth, height]);
  rightPage.drawPage(rightEmbed, { x: 0, y: 0, width: halfWidth, height });

  return splitDoc;
}

export interface MergeResult {
  pdfBytes: Uint8Array;
  pageCount: number;
}

/**
 * Merge outer (pages 1&4) and inner (pages 2&3) into correct 4-page order.
 */
export async function mergeBooklet(
  outerBytes: Uint8Array,
  innerBytes: Uint8Array
): Promise<MergeResult> {
  const outerDoc = await extractTwoPages(outerBytes);
  const innerDoc = await extractTwoPages(innerBytes);

  const merged = await PDFDocument.create();

  // Page 1 from outer (index 0)
  const [p1] = await merged.copyPages(outerDoc, [0]);
  merged.addPage(p1);

  // Page 2 from inner (index 0)
  const [p2] = await merged.copyPages(innerDoc, [0]);
  merged.addPage(p2);

  // Page 3 from inner (index 1)
  const [p3] = await merged.copyPages(innerDoc, [1]);
  merged.addPage(p3);

  // Page 4 from outer (index 1)
  const [p4] = await merged.copyPages(outerDoc, [1]);
  merged.addPage(p4);

  const pdfBytes = await merged.save();
  return { pdfBytes: new Uint8Array(pdfBytes), pageCount: 4 };
}
