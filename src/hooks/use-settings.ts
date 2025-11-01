"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Settings } from "@/lib/types";

// Hardcoded settings as the admin UI for it was removed.
const defaultSettings: Settings = {
  id: "default",
  instagram: "https://www.instagram.com/darpan_wears?igsh=a2pkYXhpajVwNnR3",
  youtube: "",
  whatsapp: "https://wa.me/9332307996",
  promoVideoUrl: "",
  logoUrl: "",
};


export function useSettings() {
  const [settings, setSettings] = useState<Settings | undefined>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, "settings"),
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const dbSettings = { id: doc.id, ...doc.data() } as Settings;
          // We merge hardcoded with DB settings, but hardcoded instagram takes precedence.
          setSettings({
            ...defaultSettings,
            ...dbSettings,
            instagram: "https://www.instagram.com/darpan_wears?igsh=a2pkYXhpajVwNnR3"
          });
        } else {
          setSettings(defaultSettings);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching settings:", error);
        setSettings(defaultSettings);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { settings, loading };
}
