
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface WelcomeLoaderProps {
  logoUrl?: string;
  show: boolean;
}

export default function WelcomeLoader({ logoUrl, show }: WelcomeLoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500",
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="flex flex-col items-center gap-6">
        {logoUrl && (
            <Image
                src={logoUrl}
                alt="Darpan Wears"
                width={100}
                height={100}
                className="rounded-full animate-pulse"
                priority
            />
        )}
        <div className="text-center">
            <h1 className="text-2xl font-bold text-primary tracking-tight">Welcome to Darpan Wears</h1>
            <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading our finest collection...
            </p>
        </div>
      </div>
    </div>
  );
}
