import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatusChipProps {
  status: 'present' | 'absent' | 'half-day' | 'leave' | 'pending' | 'approved' | 'rejected';
  size?: 'sm' | 'md';
}

const statusConfig = {
  present: { label: 'Present', className: 'status-present' },
  absent: { label: 'Absent', className: 'status-absent' },
  'half-day': { label: 'Half Day', className: 'status-pending' },
  leave: { label: 'On Leave', className: 'status-approved' },
  pending: { label: 'Pending', className: 'status-pending' },
  approved: { label: 'Approved', className: 'status-approved' },
  rejected: { label: 'Rejected', className: 'status-rejected' },
};

export const StatusChip = ({ status, size = 'md' }: StatusChipProps) => {
  const config = statusConfig[status];

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'status-chip',
        config.className,
        size === 'sm' && 'text-[10px] px-2 py-0.5'
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {config.label}
    </motion.span>
  );
};
