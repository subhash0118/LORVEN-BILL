'use client';

import { useState, useEffect } from 'react';
import { InvoiceForm, InvoiceData } from '@/components/invoice-form';
import { InvoicePreview } from '@/components/invoice-preview';
import { Button } from '@/components/ui/button';
import { Printer, Save, History, ArrowRight, ArrowLeft, Menu, X } from 'lucide-react';
import { getLastInvoiceNumber, getNextInvoiceNumber, saveInvoice } from '@/lib/invoice-manager';
import Link from 'next/link';



const defaultInvoiceData: InvoiceData = {
  companyName: 'LORVEN PEST CONTROL',
  contact: '9441757535, 7780353417',
  address: '11-6-7/a, Rockdale Layout, Waltair Main Road, Visakhapatnam – 02',
  invoiceNumber: '',
  date: new Date().toISOString().split('T')[0],
  customerName: '',
  customerAddress: '',
  customerOrderNo: 'By Work Order',
  workOrder: '',
  contactNo: '',
  workCarriedOutOn: new Date().toISOString().split('T')[0],
  items: [
    {
      description: '',
      quantity: '',
      unit: '',
      unitRateRs: '',
      unitRatePs: '',
      amountRs: '',
      amountPs: '',
    },
  ],
  termsOfPayment: 'Immediate',
  paymentMethod: 'Please pay by account payee cheque/ Demand Draft',
  includeServiceReport: false,
  serviceReportPartyName: '',
  serviceReportPartyAddress: '',
  serviceReportOfficeName: '',
  serviceReportOfficeAddress: '',
  serviceReportWorkDate: new Date().toISOString().split('T')[0],
  serviceReportServices: {
    generalPest: false,
    cockroach: false,
    antBlackAnt: false,
    rodentControl: false,
    padsMosquito: false,
    crowlingInsects: false,
  },
  serviceReportAreaTreated: '',
};

export default function Page() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData);
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize invoice number on client side
    const lastNum = getLastInvoiceNumber();
    const nextNum = getNextInvoiceNumber(lastNum);
    setInvoiceData(prev => ({ ...prev, invoiceNumber: nextNum }));
  }, []);

  const handlePrint = async () => {
    if (!invoiceData.customerName) {
      alert('Please enter a customer name before printing.');
      return;
    }
    // Silently save to history
    await saveInvoice(invoiceData);
    window.print();
  };

  const handleSave = async () => {
    if (!invoiceData.customerName) {
      alert('Please enter a customer name before saving.');
      return;
    }
    const nextInvoice = await saveInvoice(invoiceData);
    setInvoiceData(nextInvoice);
    alert('Invoice saved successfully! Ready for next invoice.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Desktop */}
      <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-700">LORVEN PESTCONTROL</h1>
            <p className="text-gray-600 text-sm mt-1">Invoice and Bill Generator</p>
          </div>
          <div className="flex gap-3 print:hidden">
            <Link href="/history">
              <Button variant="outline" className="gap-2">
                <History size={18} />
                History
              </Button>
            </Link>
            <Button onClick={handleSave} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
              <Save size={18} />
              Save Invoice
            </Button>
            <Button
              onClick={handlePrint}
              className="gap-2 bg-purple-700 hover:bg-purple-800 text-white"
            >
              <Printer size={18} />
              Print / Save as PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Header - Mobile */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-purple-700">LORVEN</h1>
            <p className="text-gray-600 text-xs">Invoice Generator</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  setMobileView('preview');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2"
              >
                <ArrowRight size={18} />
                Preview
              </button>
              <Link href="/history" className="block">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2">
                  <History size={18} />
                  History
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Dedicated Print Section - Only visible during printing */}
      <div className="hidden print:block">
        <InvoicePreview data={invoiceData} />
      </div>

      {/* Main Content - Hidden during printing to prevent duplicates */}
      <div className="max-w-7xl mx-auto px-4 py-8 print:hidden">
        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="lg:order-1">
            <InvoiceForm initialData={invoiceData} onChange={setInvoiceData} />
          </div>

          {/* Preview Section - Scaled to fit column */}
          <div className="lg:order-2 sticky top-8 h-fit">
            <div className="bg-gray-200 p-2 overflow-hidden relative rounded-lg shadow-inner">
              <div
                className="transition-transform shadow-2xl absolute top-2 left-1/2"
                style={{
                  width: '794px',
                  transform: 'translateX(-50%) scale(var(--desktop-scale, 1))',
                  transformOrigin: 'top center',
                }}
                ref={(el) => {
                  if (el) {
                    const updateScale = () => {
                      const parent = el.parentElement;
                      if (parent) {
                        const scale = (parent.clientWidth - 16) / 794;
                        el.style.setProperty('--desktop-scale', Math.min(scale, 1).toString());
                        const contentHeight = (1123 * (invoiceData.includeServiceReport ? 2 : 1)) + (invoiceData.includeServiceReport ? 24 : 0);
                        parent.style.height = `${(contentHeight * Math.min(scale, 1)) + 16}px`;
                      }
                    };
                    updateScale();
                    window.addEventListener('resize', updateScale);
                  }
                }}
              >
                <InvoicePreview data={invoiceData} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Toggle Between Form and Preview */}
        <div className="lg:hidden">
          {mobileView === 'form' ? (
            <div className="pb-32"> {/* Increased padding for clear visibility */}
              <InvoiceForm initialData={invoiceData} onChange={setInvoiceData} />

              {/* Next Button - Fixed to Bottom */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-50 safe-area-bottom">
                <Button
                  onClick={() => setMobileView('preview')}
                  className="w-full gap-2 bg-purple-700 hover:bg-purple-800 text-white py-6 text-lg shadow-lg rounded-xl"
                >
                  Next - View Preview
                  <ArrowRight size={20} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-48">
              {/* Back Button */}
              <div className="px-1">
                <Button
                  onClick={() => setMobileView('form')}
                  variant="outline"
                  className="gap-2 bg-white"
                >
                  <ArrowLeft size={18} />
                  Back to Form
                </Button>
              </div>

              {/* Scaled Preview Wrapper for Mobile */}
              <div className="bg-gray-200 p-2 overflow-hidden relative rounded-lg shadow-inner">
                <div
                  className="transition-transform shadow-2xl absolute top-2 left-1/2"
                  style={{
                    width: '794px',
                    transform: 'translateX(-50%) scale(var(--mobile-scale, 0.5))',
                    transformOrigin: 'top center',
                  }}
                  ref={(el) => {
                    if (el) {
                      const updateScale = () => {
                        const parent = el.parentElement;
                        if (parent) {
                          const scale = (parent.clientWidth - 16) / 794;
                          el.style.setProperty('--mobile-scale', scale.toString());
                          const contentHeight = (1123 * (invoiceData.includeServiceReport ? 2 : 1)) + (invoiceData.includeServiceReport ? 24 : 0);
                          parent.style.height = `${(contentHeight * scale) + 16}px`;
                        }
                      };
                      updateScale();
                      window.addEventListener('resize', updateScale);
                    }
                  }}
                >
                  <InvoicePreview data={invoiceData} />
                </div>
              </div>

              {/* Action Buttons - Fixed to Bottom */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] space-y-3 z-50 safe-area-bottom">
                <Button
                  onClick={handleSave}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white py-5 text-lg shadow-sm"
                >
                  <Save size={20} />
                  Save Invoice
                </Button>
                <Button
                  onClick={handlePrint}
                  className="w-full gap-2 bg-purple-700 hover:bg-purple-800 text-white py-5 text-lg shadow-sm"
                >
                  <Printer size={20} />
                  Print / Save as PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
