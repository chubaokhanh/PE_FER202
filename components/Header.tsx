"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-primary">
          ShelfLife
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span data-testid="user-email" className="text-sm font-medium text-muted-foreground">
                {user.email}
              </span>
              <Link
                href="/books"
                data-testid="link-books"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Books
              </Link>
              <Button
                variant="outline"
                size="sm"
                data-testid="btn-logout"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                data-testid="btn-login"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                data-testid="btn-register"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

