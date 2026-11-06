"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BookForm } from "@/components/BookForm";
import { BookSummary } from "@/components/BookSummary";
import { BookFilter } from "@/components/BookFilter";
import { BookList } from "@/components/BookList";

export default function BooksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // While finding out whether someone is logged in, nothing from this page is shown
  if (loading || !user) {
    return null;
  }

  return (
    <div data-testid="books-page" className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-5 space-y-6">
          <BookForm />
          <BookSummary />
        </div>

        <div className="xl:col-span-7 space-y-6">
          <BookFilter />
          <BookList />
        </div>
      </div>
    </div>
  );
}

