import { InvoiceData } from '@/components/invoice-form';

export interface InvoiceHistoryItem extends InvoiceData {
    id: string;
    savedAt: string;
}

const STORAGE_KEY = 'invoiceHistory';
const LAST_NUMBER_KEY = 'last_invoice_number';

export const getNextInvoiceNumber = (current: string): string => {
    if (!current) return '201/031';

    const parts = current.split('/');
    if (parts.length !== 2) return current;

    let prefix = parseInt(parts[0], 10);
    let suffix = parseInt(parts[1], 10);

    if (isNaN(prefix) || isNaN(suffix)) return current;

    suffix++;

    if (suffix > 999) { // Adjusted to 999 since we use 3 digits
        prefix++;
        suffix = 1;
    }

    return `${prefix}/${suffix.toString().padStart(3, '0')}`;
};

export const getInvoiceHistory = async (): Promise<InvoiceHistoryItem[]> => {
    if (typeof window === 'undefined') return [];

    try {
        const historyJson = localStorage.getItem(STORAGE_KEY);
        if (!historyJson) return [];
        return JSON.parse(historyJson);
    } catch (error) {
        console.error('Error reading history from localStorage:', error);
        return [];
    }
};

export const saveInvoice = async (invoice: InvoiceData): Promise<InvoiceData> => {
    if (typeof window === 'undefined') return invoice;

    const history = await getInvoiceHistory();

    // Check for duplicate invoice numbers
    const isDuplicate = history.some(item => item.invoiceNumber === invoice.invoiceNumber);
    if (isDuplicate) {
        throw new Error(`Invoice number ${invoice.invoiceNumber} already exists in history.`);
    }

    const newHistoryItem: InvoiceHistoryItem = {
        ...invoice,
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
    };

    const updatedHistory = [newHistoryItem, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    localStorage.setItem(LAST_NUMBER_KEY, invoice.invoiceNumber);

    // Return structure for next invoice
    const nextNumber = getNextInvoiceNumber(invoice.invoiceNumber);
    return {
        ...invoice,
        invoiceNumber: nextNumber,
        customerName: '',
        customerAddress: '',
        workOrder: '',
        contactNo: '',
        date: new Date().toISOString().split('T')[0],
        workCarriedOutOn: new Date().toISOString().split('T')[0],
        items: [{
            description: '',
            quantity: '',
            unit: '',
            unitRateRs: '',
            unitRatePs: '',
            amountRs: '',
            amountPs: '',
        }],
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
};

export const deleteInvoice = async (id: string): Promise<void> => {
    if (typeof window === 'undefined') return;

    const history = await getInvoiceHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const getLastInvoiceNumber = (): string => {
    if (typeof window === 'undefined') return '201/031';
    return localStorage.getItem(LAST_NUMBER_KEY) || '201/031';
};
