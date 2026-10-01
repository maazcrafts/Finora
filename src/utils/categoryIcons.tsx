import React from 'react';
import {
  Utensils,
  Car,
  Home,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  Plane,
  Tv,
  Briefcase,
  Laptop,
  TrendingUp,
  Receipt,
} from 'lucide-react';
import { TransactionCategory } from '../types/finance';

export function getCategoryIcon(category: TransactionCategory, className = 'h-4 w-4') {
  switch (category) {
    case 'Food':
      return <Utensils className={className} />;
    case 'Transport':
      return <Car className={className} />;
    case 'Housing':
      return <Home className={className} />;
    case 'Shopping':
      return <ShoppingBag className={className} />;
    case 'Bills & Utilities':
      return <Zap className={className} />;
    case 'Entertainment':
      return <Film className={className} />;
    case 'Healthcare':
      return <HeartPulse className={className} />;
    case 'Education':
      return <GraduationCap className={className} />;
    case 'Travel':
      return <Plane className={className} />;
    case 'Subscriptions':
      return <Tv className={className} />;
    case 'Salary':
      return <Briefcase className={className} />;
    case 'Freelance':
      return <Laptop className={className} />;
    case 'Investments':
      return <TrendingUp className={className} />;
    default:
      return <Receipt className={className} />;
  }
}
