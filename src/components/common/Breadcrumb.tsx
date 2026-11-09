import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono mb-4" aria-label="Breadcrumb">
      <Link to="/platform/dashboard" className="hover:text-lime transition-colors flex items-center">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            {isLast || !item.path ? (
              <span className="text-slate-200 font-medium truncate max-w-xs">{item.label}</span>
            ) : (
              <Link to={item.path} className="hover:text-lime transition-colors truncate max-w-xs">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
