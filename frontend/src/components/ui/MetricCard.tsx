import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { AnimatedCounter } from './AnimatedCounter';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
  iconColor?: string;
  decimals?: number;
}

export const MetricCard = ({
  title,
  value,
  suffix,
  prefix,
  icon: Icon,
  trend,
  delay = 0,
  iconColor = 'text-primary',
  decimals = 0,
}: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard hover3D className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <div className="text-3xl font-display font-bold">
              <AnimatedCounter value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
            </div>
            {trend && (
              <p
                className={cn(
                  'text-sm mt-2 flex items-center gap-1',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                {trend.value}% from last month
              </p>
            )}
          </div>
          <div className={cn('p-3 rounded-xl bg-primary/10', iconColor)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
