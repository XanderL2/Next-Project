import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  // ...rest of your page rendering logic
  return null; // Placeholder, replace with actual page content
}
