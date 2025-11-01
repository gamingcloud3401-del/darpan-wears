
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface WelcomeLoaderProps {
  logoUrl?: string;
  show: boolean;
}

const AnimatedBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
    )
}

export default function WelcomeLoader({ logoUrl, show }: WelcomeLoaderProps) {
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        if (show) {
            setCountdown(30);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [show]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500",
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
        <AnimatedBackground />
      <div className="z-10 flex flex-col items-center gap-6">
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
             <div className="mt-8">
                <p className="text-lg font-semibold text-primary">{countdown}</p>
                <p className="text-sm text-muted-foreground">Seconds remaining</p>
            </div>
        </div>
      </div>
    </div>
  );
}
