"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SocialLinks } from "@/lib/types";

export function useSocialLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLinks | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "settings"),
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setSocialLinks({ id: doc.id, ...doc.data() } as SocialLinks);
        } else {
          setSocialLinks(undefined);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching social links:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { socialLinks, loading };
}
