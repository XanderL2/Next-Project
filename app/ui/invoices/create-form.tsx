'use client';

import { useState } from 'react';
import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice } from '@/app/lib/actions';

interface ErrorState {
  customerId?: string;
  amount?: string;
  status?: string;
  form?: string;
}

export default function Form({ customers }: { customers: CustomerField[] }) {
  const [errors, setErrors] = useState<ErrorState>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const form = e.currentTarget;
    const formData = new FormData(form);
    let newErrors: ErrorState = {};

    // Validación cliente
    if (!formData.get('customerId')) {
      newErrors.customerId = 'Please select a customer.';
    }
    const amountValue = formData.get('amount');
    if (!amountValue || isNaN(Number(amountValue)) || Number(amountValue) <= 0) {
      newErrors.amount = 'Please enter an amount greater than $0.';
    }
    if (!formData.get('status')) {
      newErrors.status = 'Please select an invoice status.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Si todo está bien, enviar al server action
    setSubmitting(true);
    try {
      // @ts-ignore
      await createInvoice(formData);
      window.location.href = '/dashboard/invoices';
    } catch (err) {
      setErrors({ form: 'Error creating invoice. Try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customerId" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customerId"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
              aria-required="true"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {errors.customerId && (
              <p className="mt-2 text-sm text-red-500">{errors.customerId}</p>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative">
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Enter USD amount"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="amount-error"
              aria-required="true"
              inputMode="decimal"
              pattern="^\\d+(\\.\\d{1,2})?$"
            />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {errors.amount && (
              <p className="mt-2 text-sm text-red-500">{errors.amount}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="mb-4 flex gap-4" role="radiogroup" aria-labelledby="status-label">
            <label htmlFor="pending" className="flex items-center gap-2">
              <input
                id="pending"
                name="status"
                type="radio"
                value="pending"
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                aria-describedby="status-error"
                aria-required="true"
              />
              <ClockIcon className="h-5 w-5 text-gray-500" /> Pending
            </label>
            <label htmlFor="paid" className="flex items-center gap-2">
              <input
                id="paid"
                name="status"
                type="radio"
                value="paid"
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                aria-describedby="status-error"
                aria-required="true"
              />
              <CheckIcon className="h-5 w-5 text-green-600" /> Paid
            </label>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {errors.status && (
              <p className="mt-2 text-sm text-red-500">{errors.status}</p>
            )}
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Invoice'}
        </Button>
      </div>
      {errors.form && (
        <p className="mt-4 text-sm text-red-500" aria-live="polite">{errors.form}</p>
      )}
    </form>
  );
}
