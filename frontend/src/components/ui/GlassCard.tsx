import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hover3D?: boolean;
  glow?: boolean;
}

export const GlassCard = ({
  children,
  className,
  hover3D = false,
  glow = false,
  ...props
}: GlassCardProps) => {
  const baseClasses = cn(
    'glass-card rounded-xl transition-all duration-300',
    glow && 'glow-effect',
    className
  );

  if (hover3D) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={{
          scale: 1.02,
          rotateX: 2,
          rotateY: 2,
          transition: { duration: 0.2 },
        }}
        style={{ transformStyle: 'preserve-3d' }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div className={baseClasses} {...props}>
      {children}
    </motion.div>
  );
};
