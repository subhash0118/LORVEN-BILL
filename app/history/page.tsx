'use client';

import { deleteInvoice, getInvoiceHistory, InvoiceHistoryItem } from '@/lib/invoice-manager';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from 'react';

export default function HistoryPage() {
    const [history, setHistory] = useState<InvoiceHistoryItem[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        getInvoiceHistory().then(setHistory);
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteInvoice(deleteId);
            const updated = history.filter((item) => item.id !== deleteId);
            setHistory(updated);
            setIsDeleteDialogOpen(false);
            setDeleteId(null);
        } catch (error) {
            console.error('Failed to delete invoice:', error);
            alert('Failed to delete invoice');
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="outline" size="icon">
                                <ArrowLeft size={18} />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-purple-700">Invoice History</h1>
                    </div>
                </div>

                <div className="space-y-4">
                    {history.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            No saved invoices found.
                        </div>
                    ) : (
                        history.map((invoice) => (
                            <Card key={invoice.id} className="p-6 transition-shadow hover:shadow-md">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{invoice.customerName || 'Unknown Customer'}</h3>
                                        <p className="text-gray-600 text-sm">Invoice #: {invoice.invoiceNumber}</p>
                                        <p className="text-gray-600 text-sm">Date: {invoice.date}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right mr-4">
                                            <p className="font-bold text-lg">
                                                Rs. {invoice.items.reduce((acc, item) => acc + (Number(item.amountRs) || 0) + (Number(item.amountPs) || 0) / 100, 0).toFixed(2)}
                                            </p>
                                        </div>

                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => confirmDelete(invoice.id)}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the invoice
                            from your history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
