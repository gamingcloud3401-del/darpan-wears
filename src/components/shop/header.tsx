"use client";

import { ShoppingCart, Search, UserCog, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SocialLinks } from '@/lib/types';
import Link from 'next/link';

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
  socialLinks?: SocialLinks;
}

export default function Header({ searchTerm, onSearchTermChange, onAdminClick, socialLinks }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold text-primary tracking-tight">Darpan Wears</h1>
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

        <div className="flex items-center space-x-1">
           {socialLinks?.instagram && (
            <Button variant="ghost" size="icon" asChild>
              <Link href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
              </Link>
            </Button>
          )}
          {socialLinks?.youtube && (
            <Button variant="ghost" size="icon" asChild>
              <Link href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                <Youtube className="h-5 w-5" />
              </Link>
            </Button>
          )}
          {socialLinks?.whatsapp && (
             <Button variant="ghost" size="icon" asChild>
              <Link href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5" />
              </Link>
            </Button>
          )}
           <Button variant="ghost" onClick={onAdminClick}>
            <UserCog className="mr-2 h-5 w-5" />
            Admin
          </Button>
        </div>
      </div>
    </header>
  );
}
