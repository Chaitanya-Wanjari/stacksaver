"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);

    const dark = document.documentElement.classList.contains("dark");

    setIsDark(dark);
  }, []);

  function toggleTheme() {
    const root = document.documentElement;

    const nextDark = !isDark;

    setIsDark(nextDark);

    if (nextDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <div className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}