import { jsPDF } from 'jspdf';

/**
 * MEDIYATRA Official PDF Receipt & Medical Voucher Generator
 * Generates structured, high-resolution PDF documents with full clinical, financial, and booking details.
 */
export function generateOfficialPDFReceipt(data) {
  const {
    documentType = 'OFFICIAL MEDICAL RECEIPT',
    referenceNo = `MY-REF-${Math.floor(100000 + Math.random() * 900000)}`,
    date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    patientName = 'Valued Patient',
    patientEmail = 'N/A',
    patientPhone = 'N/A',
    doctorName = 'N/A',
    doctorSpecialty = 'N/A',
    hospitalName = 'N/A',
    hospitalCity = 'New Delhi',
    hospitalAddress = 'Press Enclave Marg, Saket, New Delhi',
    amountPaid = '₹0',
    status = 'VERIFIED & CONFIRMED',
    details = [],
    notes = 'Please present this official PDF voucher at the hospital receptiondesk along with your passport/photo ID.'
  } = data;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Primary Header Color Block (#2D3A5E)
  doc.setFillColor(45, 58, 94);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('MEDIYATRA', 15, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(143, 169, 255);
  doc.text('GLOBAL HEALTHCARE NETWORK & MEDICAL CONCIERGE', 15, 25);
  doc.text('Official Accredited Hospital Network Desk • New Delhi, India', 15, 30);

  // Document Badge on Right
  doc.setFillColor(26, 35, 61);
  doc.roundedRect(pageWidth - 85, 10, 70, 20, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(documentType.toUpperCase(), pageWidth - 50, 18, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(143, 169, 255);
  doc.text(`REF: ${referenceNo}`, pageWidth - 50, 25, { align: 'center' });

  // 2. Reference & Date Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 40, pageWidth, 12, 'F');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`ISSUED DATE: ${date}`, 15, 47);
  doc.text(`STATUS: ${status}`, pageWidth - 15, 47, { align: 'right' });

  let y = 60;

  // 3. Patient Details Section Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, y, (pageWidth - 35) / 2, 45, 2, 2, 'FD');

  doc.setFontSize(10);
  doc.setTextColor(45, 58, 94);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT IDENTIFICATION', 20, y + 8);
  doc.setLineWidth(0.5);
  doc.setDrawColor(143, 169, 255);
  doc.line(20, y + 10, 80, y + 10);

  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`Full Name: `, 20, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patientName}`, 42, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.text(`Email: `, 20, y + 26);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patientEmail}`, 42, y + 26);

  doc.setFont('helvetica', 'bold');
  doc.text(`Contact: `, 20, y + 34);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patientPhone}`, 42, y + 34);

  // 4. Healthcare Provider Details Box
  const rightX = 20 + (pageWidth - 35) / 2;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(rightX, y, (pageWidth - 35) / 2, 45, 2, 2, 'FD');

  doc.setFontSize(10);
  doc.setTextColor(45, 58, 94);
  doc.setFont('helvetica', 'bold');
  doc.text('HEALTHCARE PROVIDER', rightX + 5, y + 8);
  doc.line(rightX + 5, y + 10, rightX + 65, y + 10);

  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`Hospital: `, rightX + 5, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(`${hospitalName}`, rightX + 25, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.text(`Doctor: `, rightX + 5, y + 26);
  doc.setFont('helvetica', 'normal');
  doc.text(`${doctorName} (${doctorSpecialty})`, rightX + 25, y + 26);

  doc.setFont('helvetica', 'bold');
  doc.text(`Location: `, rightX + 5, y + 34);
  doc.setFont('helvetica', 'normal');
  doc.text(`${hospitalCity}, India`, rightX + 25, y + 34);

  y += 55;

  // 5. Itemized Breakdown Table Header
  doc.setFillColor(45, 58, 94);
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIPTION OF CLINICAL SERVICES & CONCIERGE CHARGES', 20, y + 5.5);
  doc.text('AMOUNT', pageWidth - 20, y + 5.5, { align: 'right' });

  y += 8;

  // Table Rows
  const tableItems = details.length > 0 ? details : [
    { label: `${documentType} - ${hospitalName}`, value: amountPaid },
    { label: 'International Patient Desk Concierge & Visa Support', value: 'INCLUDED' },
    { label: 'Emergency 24/7 Helpline & Case Tracking', value: 'INCLUDED' }
  ];

  tableItems.forEach((item, index) => {
    doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252);
    doc.rect(15, y, pageWidth - 30, 8, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(15, y + 8, pageWidth - 15, y + 8);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(item.label, 20, y + 5.5);
    doc.setFont('helvetica', 'bold');
    doc.text(item.value, pageWidth - 20, y + 5.5, { align: 'right' });

    y += 8;
  });

  // Total Summary Bar
  y += 2;
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, pageWidth - 30, 10, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(45, 58, 94);
  doc.text('TOTAL AMOUNT REGISTERED:', 20, y + 6.5);
  doc.setFontSize(11);
  doc.setTextColor(4, 120, 87);
  doc.text(amountPaid, pageWidth - 20, y + 6.5, { align: 'right' });

  y += 18;

  // 6. Clinical Instructions & Terms Box
  doc.setDrawColor(143, 169, 255);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 32, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(45, 58, 94);
  doc.setFont('helvetica', 'bold');
  doc.text('IMPORTANT PATIENT INSTRUCTIONS & CLINICAL GUIDELINES:', 20, y + 7);

  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  const splitNotes = doc.splitTextToSize(notes, pageWidth - 40);
  doc.text(splitNotes, 20, y + 14);

  y += 42;

  // 7. Official Seal & Stamp Verification
  doc.setDrawColor(203, 213, 225);
  doc.line(15, y, pageWidth - 15, y);

  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('AUTHENTICATED BY MEDIYATRA GLOBAL CONCIERGE DESK', 15, y);
  doc.text('OFFICIAL HOSPITAL PARTNER STAMP', pageWidth - 15, y, { align: 'right' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a digitally generated clinical document verified by MEDIYATRA API Server.', 15, y + 5);
  doc.text('Hospital Reception Desk Authorization Code: MY-VERIFIED-2026', pageWidth - 15, y + 5, { align: 'right' });

  // Save the PDF file
  const filename = `${documentType.toLowerCase().replace(/\s+/g, '_')}_${referenceNo}.pdf`;
  doc.save(filename);
  return filename;
}
