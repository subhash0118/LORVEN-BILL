'use client';

import React from 'react';
import { ServiceReportPreview } from './service-report-preview';

interface LineItem {
  description: string;
  quantity: string;
  unit: string;
  unitRateRs: string;
  unitRatePs: string;
  amountRs: string;
  amountPs: string;
}

interface InvoiceData {
  companyName: string;
  contact: string;
  address: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerAddress: string;
  customerOrderNo: string;
  workOrder: string;
  contactNo: string;
  workCarriedOutOn: string;
  items: LineItem[];
  termsOfPayment: string;
  paymentMethod: string;
  includeServiceReport?: boolean;
  serviceReportPartyName?: string;
  serviceReportPartyAddress?: string;
  serviceReportOfficeName?: string;
  serviceReportOfficeAddress?: string;
  serviceReportWorkDate?: string;
  serviceReportServices?: {
    generalPest?: boolean;
    cockroach?: boolean;
    antBlackAnt?: boolean;
    rodentControl?: boolean;
    padsMosquito?: boolean;
    crowlingInsects?: boolean;
  };
  serviceReportAreaTreated?: string;
}

interface InvoicePreviewProps {
  data: InvoiceData;
}

function numberToWords(num: number): string {
  if (num === 0) return 'Zero';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertToWordsLessThan1000(n: number): string {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred';
      n %= 100;
      if (n > 0) str += ' ';
    }
    if (n > 0) {
      if (n < 10) {
        str += ones[n];
      } else if (n < 20) {
        str += teens[n - 10];
      } else {
        str += tens[Math.floor(n / 10)];
        if (n % 10 > 0) str += ' ' + ones[n % 10];
      }
    }
    return str;
  }

  // Handle first 3 digits
  let result = convertToWordsLessThan1000(num % 1000);
  num = Math.floor(num / 1000);

  const scales = ['Thousand', 'Lakh', 'Crore'];
  let scaleIndex = 0;

  while (num > 0 && scaleIndex < scales.length) {
    const chunk = num % 100;
    if (chunk > 0) {
      const chunkStr = convertToWordsLessThan1000(chunk);
      result = chunkStr + ' ' + scales[scaleIndex] + (result ? ' ' + result : '');
    }
    num = Math.floor(num / 100);
    scaleIndex++;
  }

  return result.trim();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}-${month}-${year}`;
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
  // Calculate totals
  const rawRs = data.items.reduce((sum, item) => sum + (Number(item.amountRs) || 0), 0);
  const rawPs = data.items.reduce((sum, item) => sum + (Number(item.amountPs) || 0), 0);

  const totalRs = rawRs + Math.floor(rawPs / 100);
  const totalPs = rawPs % 100;

  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 print:bg-white print:p-0 gap-6 print:gap-0">
      {/* Invoice - Page 1 */}
      <div
        className="invoice-preview print:bg-white print:p-0"
        style={{
          width: '794px',
          minHeight: '1080px', // Slightly shorter than 1123px to account for printing safe zones
          padding: '40px',
          backgroundColor: '#fff',
          margin: '0 auto',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: '12px', borderBottom: '2px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ margin: '0', fontSize: '26px', fontWeight: 'bold', color: '#6B46C1', lineHeight: '1' }}>
            {data.companyName}
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: '#6B46C1', marginBottom: '4px' }}>INVOICE</p>
            <div style={{ display: 'flex', fontSize: '11px', border: '1px solid #000' }}>
              <div style={{ paddingRight: '8px', paddingLeft: '8px', paddingTop: '4px', paddingBottom: '4px', borderRight: '1px solid #000' }}>
                <p style={{ margin: '0', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #000' }}>Date:</p>
                <p style={{ margin: '0', textAlign: 'center', minWidth: '70px', paddingTop: '2px' }}>
                  {formatDate(data.date)}
                </p>
              </div>
              <div style={{ paddingRight: '8px', paddingLeft: '8px', paddingTop: '4px', paddingBottom: '4px' }}>
                <p style={{ margin: '0', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #000' }}>No.</p>
                <p style={{ margin: '0', textAlign: 'center', minWidth: '50px', paddingTop: '2px' }}>
                  {data.invoiceNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Section: Customer Address on Left, Details on Right */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', minHeight: '70px' }}>
          {/* Left: Customer Address */}
          <div
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #000',
              fontSize: '12px',
              lineHeight: '1.3',
            }}
          >
            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>To,</p>
            <p style={{ margin: '0', whiteSpace: 'pre-wrap' }}>{data.customerName}</p>
            <p style={{ margin: '2px 0 0 0', whiteSpace: 'pre-wrap', fontSize: '12px' }}>{data.customerAddress}</p>
          </div>

          {/* Right: Customer Details Fields */}
          <div
            style={{
              width: '280px',
              padding: '8px',
              border: '1px solid #000',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              fontSize: '12px',
              lineHeight: '1.4',
            }}
          >
            <p style={{ margin: '0 0 4px 0' }}>
              <span style={{ fontWeight: 'bold' }}>Customers Order No</span>
            </p>
            <p style={{ margin: '0 0 4px 0' }}>
              {data.customerOrderNo}
            </p>
            <p style={{ margin: '0 0 4px 0' }}>
              <span style={{ fontWeight: 'bold' }}>Our Contact No: By Qtn</span>
            </p>
            <p style={{ margin: '0 0 4px 0' }}>{data.contactNo}</p>
            <p style={{ margin: '0' }}>
              <span style={{ fontWeight: 'bold' }}>Work Carried out on :</span>
            </p>
            <p style={{ margin: '0' }}>{formatDate(data.workCarriedOutOn)}</p>
          </div>
        </div>

        {/* Table Section - Vertical Lines Only */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', marginBottom: '0', borderTop: '1px solid #000', borderLeft: '1px solid #000', borderRight: '1px solid #000' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', backgroundColor: '#6B46C1', color: '#fff', fontWeight: 'bold', fontSize: '12px', height: '28px' }}>
            <div style={{ flex: '30%', padding: '4px', borderRight: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              DESCRIPTION
            </div>
            <div style={{ width: '8%', padding: '4px', textAlign: 'center', borderRight: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Qty
            </div>
            <div style={{ width: '14%', padding: '4px', textAlign: 'center', borderRight: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Unit Area
            </div>
            <div style={{ width: '16%', padding: '4px', textAlign: 'center', borderRight: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <span>Rate</span>
              </div>
            </div>
            <div style={{ width: '32%', padding: '4px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Amount
            </div>
          </div>

          {/* Sub-header Row */}
          <div style={{ display: 'flex', backgroundColor: '#6B46C1', color: '#fff', fontSize: '12px', height: '24px' }}>
            <div style={{ flex: '30%', padding: '2px 4px', borderRight: '1px solid #000' }}></div>
            <div style={{ width: '8%', padding: '2px 4px', borderRight: '1px solid #000', textAlign: 'center' }}></div>
            <div style={{ width: '14%', padding: '2px 4px', borderRight: '1px solid #000', textAlign: 'center' }}>Area</div>
            <div style={{ width: '16%', display: 'flex', borderRight: '1px solid #000' }}>
              <div style={{ flex: 1, borderRight: '1px solid #fff', textAlign: 'center', padding: '2px' }}>Rs.</div>
              <div style={{ width: '50px', textAlign: 'center', padding: '2px' }}>Ps.</div>
            </div>
            <div style={{ width: '32%', display: 'flex' }}>
              <div style={{ flex: 1, borderRight: '1px solid #fff', textAlign: 'center', padding: '2px' }}>Rs.</div>
              <div style={{ width: '70px', textAlign: 'center', padding: '2px' }}>Ps.</div>
            </div>
          </div>

          {/* Data Rows */}
          {data.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', borderBottom: idx === data.items.length - 1 ? 'none' : 'none', minHeight: '30px' }}>
              <div style={{ flex: '30%', padding: '4px', borderRight: '1px solid #000', fontSize: '14px', wordWrap: 'break-word', overflow: 'hidden' }}>
                {item.description}
              </div>
              <div style={{ width: '8%', padding: '4px', textAlign: 'center', borderRight: '1px solid #000', fontSize: '12px' }}>
                {item.quantity || ''}
              </div>
              <div style={{ width: '14%', padding: '4px', textAlign: 'center', borderRight: '1px solid #000', fontSize: '12px' }}>
                {item.unit || ''}
              </div>
              <div style={{ width: '16%', display: 'flex', borderRight: '1px solid #000', fontSize: '12px' }}>
                <div style={{ flex: 1, borderRight: '1px solid #000', textAlign: 'right', padding: '4px' }}>{item.unitRateRs || ''}</div>
                <div style={{ width: '50px', textAlign: 'center', padding: '4px' }}>{item.unitRatePs || ''}</div>
              </div>
              <div style={{ width: '32%', display: 'flex', fontSize: '12px' }}>
                <div style={{ flex: 1, borderRight: '1px solid #000', textAlign: 'right', padding: '4px' }}>{item.amountRs || ''}</div>
                <div style={{ width: '70px', textAlign: 'center', padding: '4px' }}>{item.amountPs || ''}</div>
              </div>
            </div>
          ))}

          {/* Empty space to fill page */}
          <div style={{ display: 'flex', flex: 1, minHeight: '30px' }}>
            <div style={{ flex: '30%', padding: '4px', borderRight: '1px solid #000' }}></div>
            <div style={{ width: '8%', padding: '4px', borderRight: '1px solid #000' }}></div>
            <div style={{ width: '14%', padding: '4px', borderRight: '1px solid #000' }}></div>
            <div style={{ width: '16%', display: 'flex', borderRight: '1px solid #000' }}>
              <div style={{ flex: 1, borderRight: '1px solid #000' }}></div>
              <div style={{ width: '50px' }}></div>
            </div>
            <div style={{ width: '32%', display: 'flex' }}>
              <div style={{ flex: 1, borderRight: '1px solid #000' }}></div>
              <div style={{ width: '70px' }}></div>
            </div>
          </div>
        </div>

        {/* Totals Row - continues from data rows */}
        <div style={{ display: 'flex', borderLeft: '1px solid #000', borderRight: '1px solid #000', borderBottom: '1px solid #000', borderTop: '1px solid #000', minHeight: '40px', marginBottom: '12px' }}>
          <div style={{ width: '52%', padding: '8px', borderRight: '1px solid #000', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            Total
          </div>
          <div style={{ width: '16%', borderRight: '1px solid #000' }}></div>
          <div style={{ width: '32%', display: 'flex', fontSize: '12px', fontWeight: 'bold' }}>
            <div style={{ flex: 1, borderRight: '1px solid #000', textAlign: 'right', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{totalRs}</div>
            <div style={{ width: '70px', textAlign: 'center', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{totalPs}</div>
          </div>
        </div>

        {/* Amount in Words */}
        <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>
          Rupees {numberToWords(totalRs)} Only.
        </div>

        {/* Footer Section - Boxed */}
        <div style={{ border: '2px solid #000', padding: '8px', fontSize: '12px', marginTop: '12px', display: 'flex', flexDirection: 'column', minHeight: '120px', justifyContent: 'space-between' }}>
          {/* Top Row: Terms & For Company */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 4px 0' }}>
                <span style={{ fontWeight: 'bold' }}>Terms of payment :</span> {data.termsOfPayment}
              </p>
              <p style={{ margin: '0' }}>Please pay by account payee cheque/ Demand Draft</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0', fontWeight: 'bold', color: '#6B46C1', fontSize: '14px' }}>For {data.companyName}</p>
            </div>
          </div>

          {/* Bottom Row: Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', padding: '0 40px' }}>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <p style={{ margin: '0', borderTop: '1px solid #000', paddingTop: '4px', fontSize: '12px' }}>
                Prepared by
              </p>
            </div>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <p style={{ margin: '0', borderTop: '1px solid #000', paddingTop: '4px', fontSize: '12px' }}>
                Checked by
              </p>
            </div>
          </div>
        </div>

        {/* Address Footer Below Box */}
        <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '8px', color: '#6B46C1', fontWeight: '500' }}>
          <p style={{ margin: '0' }}>
            {data.address}, {data.contact}, lorverindia@yahoo.co.in
          </p>
        </div>
      </div>

      {/* Service Report - Page 2 */}
      {data.includeServiceReport && (
        <ServiceReportPreview data={data} />
      )}

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .invoice-preview {
            box-shadow: none;
            margin: 0 !important;
            padding: 15mm !important;
            overflow: visible !important;
            width: 210mm !important;
            height: 297mm !important;
            page-break-after: always;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .service-report-preview {
            box-shadow: none;
            margin: 0 !important;
            padding: 15mm !important;
            overflow: visible !important;
            max-width: 210mm !important;
            width: 210mm !important;
            height: 297mm !important;
            font-size: 12px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .page-break-before {
            page-break-before: always;
          }
        }
        
        @media (max-width: 640px) {
          .service-report-preview {
            padding: 15px !important;
          }
        }
      `}</style>
    </div>
  );
}
