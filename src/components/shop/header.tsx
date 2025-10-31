"use client";

import { ShoppingCart, Search, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onAdminClick: () => void;
}

export default function Header({ searchTerm, onSearchTermChange, onAdminClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold text-primary tracking-tight">eCommerce Simplified</h1>
        </div>
        
        <div className="flex-1 flex justify-center px-4 lg:px-16">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products or categories..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
           <Button variant="ghost" onClick={onAdminClick}>
            <UserCog className="mr-2 h-5 w-5" />
            Admin
          </Button>
        </div>
      </div>
    </header>
  );
}
