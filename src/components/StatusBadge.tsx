import React from 'react';
import { Order } from '../types/order';

interface StatusBadgeProps {
  status: Order['status'];
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  new: {
    label: 'New',
    color: 'bg-red-500 text-white',
    pulse: 'animate-pulse'
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-yellow-500 text-white',
    pulse: ''
  },
  ready: {
    label: 'Ready',
    color: 'bg-green-500 text-white',
    pulse: 'animate-pulse'
  },
  completed: {
    label: 'Completed',
    color: 'bg-gray-500 text-white',
    pulse: ''
  }
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.color} ${config.pulse} ${sizeClass}`}>
      {config.label}
    </span>
  );
};