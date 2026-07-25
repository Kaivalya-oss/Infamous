import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  maxQuantity?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function QuantitySelector({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  maxQuantity = 10,
  className = '',
  size = 'md'
}: QuantitySelectorProps) {
  
  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  const isMaxReached = quantity >= maxQuantity;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className={`inline-flex items-center justify-between border border-black/10 rounded-full bg-white/50 backdrop-blur-sm ${sizeClasses[size]} w-32`}>
        <button
          onClick={onDecrease}
          className="w-8 h-full flex items-center justify-center text-textSecondary hover:text-black transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
        </button>
        
        <span className="font-medium text-black tabular-nums w-8 text-center select-none">
          {quantity}
        </span>
        
        <button
          onClick={onIncrease}
          disabled={isMaxReached}
          className={`w-8 h-full flex items-center justify-center transition-colors ${
            isMaxReached 
              ? 'text-black/20 cursor-not-allowed' 
              : 'text-textSecondary hover:text-black'
          }`}
          aria-label="Increase quantity"
        >
          <Plus size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
        </button>
      </div>
      
      {isMaxReached && (
        <motion.span 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-textSecondary text-center italic"
        >
          Max available quantity reached
        </motion.span>
      )}
    </div>
  );
}
