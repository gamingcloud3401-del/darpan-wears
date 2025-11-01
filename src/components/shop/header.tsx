
"use client";

import { ShoppingCart, Search, UserCog, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

// Inline SVG for WhatsApp as it's not in lucide-react
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);


interface HeaderProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onAdminClick: () => void;
  settings?: Settings;
}

export default function Header({ searchTerm, onSearchTermChange, onAdminClick, settings }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex flex-col px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-2">
            {settings?.logoUrl ? (
              <Image src={settings.logoUrl} alt="Darpan Wears Logo" width={40} height={40} className="rounded-md" />
            ) : (
              <ShoppingCart className="h-7 w-7 text-primary" />
            )}
            <h1 className="text-lg sm:text-xl font-bold text-primary tracking-tight">Darpan Wears</h1>
          </div>
          
          <div className="flex items-center space-x-0 sm:space-x-1">
            {settings?.instagram && (
              <Button variant="ghost" size="icon" asChild>
                <Link href={settings.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </Link>
              </Button>
            )}
            {settings?.youtube && (
              <Button variant="ghost" size="icon" asChild>
                <Link href={settings.youtube} target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-5 w-5" />
                </Link>
              </Button>
            )}
            {settings?.whatsapp && (
              <Button variant="ghost" size="icon" asChild>
                <Link href={settings.whatsapp} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <Button variant="ghost" onClick={onAdminClick} className="px-2 sm:px-4">
              <UserCog className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </div>
        </div>

        <div className="w-full pt-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
