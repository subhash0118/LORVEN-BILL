'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/material-design-3-switch';

export interface LineItem {
  description: string;
  quantity: string;
  unit: string;
  unitRateRs: string;
  unitRatePs: string;
  amountRs: string;
  amountPs: string;
}

export interface InvoiceData {
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

interface InvoiceFormProps {
  initialData: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export function InvoiceForm({ initialData, onChange }: InvoiceFormProps) {
  const [data, setData] = useState<InvoiceData>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleCompanyChange = (field: string, value: string) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    onChange(updated);
  };

  const handleInvoiceChange = (field: string, value: any) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    onChange(updated);
  };

  // Auto-populate service report party fields when service report is enabled
  useEffect(() => {
    if (data.includeServiceReport && !data.serviceReportPartyName && data.customerName) {
      const updated = {
        ...data,
        serviceReportPartyName: data.customerName,
        serviceReportPartyAddress: data.customerAddress,
      };
      setData(updated);
      onChange(updated);
    }
  }, [data.includeServiceReport, data.customerName, data.customerAddress, data.serviceReportPartyName, onChange]);

  const handleCustomerChange = (field: string, value: string) => {
    const updated = { ...data, [field]: value };

    // Auto-populate service report party fields from customer fields
    if (data.includeServiceReport) {
      if (field === 'customerName') {
        updated.serviceReportPartyName = value;
      } else if (field === 'customerAddress') {
        updated.serviceReportPartyAddress = value;
      }
    }

    setData(updated);
    onChange(updated);
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const items = [...data.items];
    const item = { ...items[index] };

    if (field === 'quantity') {
      item.quantity = value as string;
    } else if (
      field === 'unitRateRs' ||
      field === 'unitRatePs' ||
      field === 'amountRs' ||
      field === 'amountPs'
    ) {
      // Allow only valid integers (digits only)
      if (/^\d*$/.test(value as string)) {
        item[field] = value as string;
      }
    } else {
      item[field] = value as string;
    }

    items[index] = item;
    const updated = { ...data, items };
    setData(updated);
    onChange(updated);
  };

  const addItem = () => {
    const items = [
      ...data.items,
      {
        description: '',
        quantity: '',
        unit: '',
        unitRateRs: '',
        unitRatePs: '',
        amountRs: '',
        amountPs: '',
      },
    ];
    const updated = { ...data, items };
    setData(updated);
    onChange(updated);
  };

  const removeItem = (index: number) => {
    const items = data.items.filter((_, i) => i !== index);
    const updated = { ...data, items };
    setData(updated);
    onChange(updated);
  };

  const handleServiceTypeChange = (index: number, value: string) => {
    let description = '';

    if (value === 'general-service') {
      const date = new Date(data.workCarriedOutOn);
      let monthYear = '[Select Date]';
      if (!isNaN(date.getTime())) {
        monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      }
      description = `Being our charges to carry out\ngeneral pestcontrol services for\nthe month of ${monthYear}`;
    } else if (value === 'post-construction') {
      description = 'Being our charges to carry out Post Construction Anti-Termite Treatment';
    }

    if (description) {
      handleItemChange(index, 'description', description);
    }
  };

  return (
    <div className="w-full space-y-6 max-h-[1123px] overflow-y-auto pr-4">
      {/* Company Information */}
      <Card className="p-4">
        <h2 className="text-lg font-bold mb-4 text-purple-700">Company Information</h2>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-semibold">Company Name</Label>
            <Input
              value={data.companyName}
              onChange={(e) => handleCompanyChange('companyName', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Contact Number</Label>
            <Input
              value={data.contact}
              onChange={(e) => handleCompanyChange('contact', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Address</Label>
            <Input
              value={data.address}
              onChange={(e) => handleCompanyChange('address', e.target.value)}
              className="mt-1"
              placeholder="Street, City - Pin, Phone, Email"
            />
          </div>
        </div>
      </Card>

      {/* Invoice Details */}
      <Card className="p-4">
        <h2 className="text-lg font-bold mb-4 text-purple-700">Invoice Details</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-semibold">Invoice No</Label>
              <Input
                value={data.invoiceNumber}
                onChange={(e) => handleCustomerChange('invoiceNumber', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">Date</Label>
              <Input
                type="date"
                value={data.date}
                onChange={(e) => handleInvoiceChange('date', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Customer Details */}
      <Card className="p-4">
        <h2 className="text-lg font-bold mb-4 text-purple-700">Customer Details</h2>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-semibold">Customer Name / Company</Label>
            <Input
              value={data.customerName}
              onChange={(e) => handleCustomerChange('customerName', e.target.value)}
              className="mt-1"
              placeholder="M/S Emmennar Pharma Containers Pvt Ltd"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Customer Address (To:)</Label>
            <textarea
              value={data.customerAddress}
              onChange={(e) => handleCustomerChange('customerAddress', e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded text-sm"
              rows={3}
              placeholder="Plot No.31, JNPC, Thanam(V), Parawada(M), Anakapalli Dist."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Customers Order No–By Work Order</Label>
              <Input
                value={data.customerOrderNo}
                onChange={(e) => handleCustomerChange('customerOrderNo', e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Our Contact No</Label>
              <Input
                value={data.contactNo}
                onChange={(e) => handleCustomerChange('contactNo', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-semibold">Work Carried Out On</Label>
            <Input
              type="date"
              value={data.workCarriedOutOn}
              onChange={(e) => handleCustomerChange('workCarriedOutOn', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Line Items */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-purple-700">Line Items</h2>
          <Button onClick={addItem} size="sm" className="gap-2 bg-purple-700 hover:bg-purple-800">
            <Plus size={16} />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {data.items.map((item, idx) => (
            <Card key={idx} className="p-3 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-semibold text-gray-600">Item {idx + 1}</span>
                <Button
                  onClick={() => removeItem(idx)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Quick Fill Description (Optional)</Label>
                  <Select onValueChange={(val) => handleServiceTypeChange(idx, val)}>
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue placeholder="Select service type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general-service">General Service (Month)</SelectItem>
                      <SelectItem value="post-construction">Post Construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold">Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="mt-1 text-sm"
                    placeholder="Service or item description"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs font-semibold">Qty</Label>
                    <Input
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Unit</Label>
                    <Input
                      value={item.unit}
                      onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                      className="mt-1 text-sm"
                      placeholder="Area/Sqft"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-semibold">Unit Rate (Rs.)</Label>
                    <Input
                      type="number"
                      value={item.unitRateRs}
                      onChange={(e) => handleItemChange(idx, 'unitRateRs', e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Unit Rate (Ps.)</Label>
                    <Input
                      type="number"
                      value={item.unitRatePs}
                      onChange={(e) => handleItemChange(idx, 'unitRatePs', e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-semibold">Amount (Rs.)</Label>
                    <Input
                      type="number"
                      value={item.amountRs}
                      onChange={(e) => handleItemChange(idx, 'amountRs', e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Amount (Ps.)</Label>
                    <Input
                      type="number"
                      value={item.amountPs}
                      onChange={(e) => handleItemChange(idx, 'amountPs', e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Service Report Toggle */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-purple-700">Service Report</h2>
            <p className="text-sm text-muted-foreground">
              Need service report for this?
            </p>
          </div>
          <Switch
            checked={data.includeServiceReport}
            onCheckedChange={(checked) => handleInvoiceChange('includeServiceReport', checked as any)}
            showIcons={true}
          />
        </div>

        {data.includeServiceReport && (
          <div className="mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-semibold">Party Name</Label>
                <Input
                  value={data.serviceReportPartyName || ''}
                  onChange={(e) => handleInvoiceChange('serviceReportPartyName', e.target.value)}
                  className="mt-1"
                  placeholder="M/S Emmennar Pharma Containers PrivateLtd"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">Office Name</Label>
                <Input
                  value={data.serviceReportOfficeName || ''}
                  onChange={(e) => handleInvoiceChange('serviceReportOfficeName', e.target.value)}
                  className="mt-1"
                  placeholder="M/S LORVEN Pest Control"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-semibold">Party Address</Label>
                <textarea
                  value={data.serviceReportPartyAddress || ''}
                  onChange={(e) => handleInvoiceChange('serviceReportPartyAddress', e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded text-sm"
                  rows={3}
                  placeholder="Plot No.31, JNPC, Thanam(V), Parawada(M), Anakapalli Dist."
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">Office Address</Label>
                <textarea
                  value={data.serviceReportOfficeAddress || ''}
                  onChange={(e) => handleInvoiceChange('serviceReportOfficeAddress', e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded text-sm"
                  rows={3}
                  placeholder="11-7-5/a, Waltair Main Road, Visakhapatnam-530003"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold">Work Carried Out On</Label>
              <Input
                type="date"
                value={data.serviceReportWorkDate || ''}
                onChange={(e) => handleInvoiceChange('serviceReportWorkDate', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Type of Service</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.serviceReportServices?.generalPest || false}
                    onChange={(e) => handleInvoiceChange('serviceReportServices', {
                      ...data.serviceReportServices,
                      generalPest: e.target.checked
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">General Pest Control Cockroach control</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.serviceReportServices?.antBlackAnt || false}
                    onChange={(e) => handleInvoiceChange('serviceReportServices', {
                      ...data.serviceReportServices,
                      antBlackAnt: e.target.checked
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Ant and Black ant control</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.serviceReportServices?.rodentControl || false}
                    onChange={(e) => handleInvoiceChange('serviceReportServices', {
                      ...data.serviceReportServices,
                      rodentControl: e.target.checked
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Rodent Control bait (or)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.serviceReportServices?.padsMosquito || false}
                    onChange={(e) => handleInvoiceChange('serviceReportServices', {
                      ...data.serviceReportServices,
                      padsMosquito: e.target.checked
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Pads Mosquito Control</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.serviceReportServices?.crowlingInsects || false}
                    onChange={(e) => handleInvoiceChange('serviceReportServices', {
                      ...data.serviceReportServices,
                      crowlingInsects: e.target.checked
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Crowling insects</span>
                </label>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold">Area/Premise Treated</Label>
              <textarea
                value={data.serviceReportAreaTreated || ''}
                onChange={(e) => handleInvoiceChange('serviceReportAreaTreated', e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded text-sm"
                rows={2}
                placeholder="Emmennar Pharma Containers building out side and Inside perimeter treatment Only."
              />
            </div>
          </div>
        )}
      </Card>

      {/* Terms and Conditions */}
      <Card className="p-4">
        <h2 className="text-lg font-bold mb-4 text-purple-700">Terms</h2>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-semibold">Terms of Payment</Label>
            <Input
              value={data.termsOfPayment}
              onChange={(e) => handleInvoiceChange('termsOfPayment', e.target.value)}
              className="mt-1"
              placeholder="e.g., Immediate"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Payment Method</Label>
            <Input
              value={data.paymentMethod}
              onChange={(e) => handleInvoiceChange('paymentMethod', e.target.value)}
              className="mt-1"
              placeholder="e.g., Account payee cheque/ Demand Draft"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
