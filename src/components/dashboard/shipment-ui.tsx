import type { Shipment } from '@/lib/api';
export { initials } from '@/lib/utils';

export const TERMINAL_STATUSES: Shipment['status'][] = [
  'DELIVERED',
  'CANCELLED',
  'EXPIRED',
  'RESOLVED',
];

export const STATUS_ORDER: Shipment['status'][] = ['OPEN', 'ACCEPTED', 'IN_TRANSIT', 'DELIVERED'];

export const statusStyles: Record<Shipment['status'], { label: string; className: string }> = {
  OPEN: { label: 'Open', className: 'border-border bg-secondary text-muted-foreground' },
  ACCEPTED: { label: 'Accepted', className: 'border-accent bg-accent/15 text-accent' },
  IN_TRANSIT: { label: 'In transit', className: 'border-primary bg-primary/10 text-primary' },
  DELIVERED: { label: 'Delivered', className: 'border-success bg-success/15 text-success' },
  CANCELLED: {
    label: 'Cancelled',
    className: 'border-destructive bg-destructive/10 text-destructive',
  },
  EXPIRED: { label: 'Expired', className: 'border-destructive bg-destructive/10 text-destructive' },
  DISPUTED: {
    label: 'Disputed',
    className: 'border-destructive bg-destructive/10 text-destructive',
  },
  RESOLVED: { label: 'Resolved', className: 'border-success bg-success/15 text-success' },
};

export function formatAmount(amount: number, assetCode: Shipment['assetCode']) {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(amount)} ${assetCode}`;
}

