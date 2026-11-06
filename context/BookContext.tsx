"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string;
  pages: number;
  status: "To Read" | "Reading" | "Finished";
  created_at: string;
}

interface BookContextType {
  books: Book[];
  filteredBooks: Book[];
  loading: boolean;
  filterStatus: string;
  searchQuery: string;
  setFilterStatus: (status: string) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  addBook: (bookData: {
    title: string;
    author: string;
    pages: number;
    status: "To Read" | "Reading" | "Finished";
  }) => Promise<{ error: Error | null; data?: Book }>;
  advanceStatus: (book: Book) => Promise<{ error: Error | null }>;
  deleteBook: (bookId: string) => Promise<{ error: Error | null }>;
  refreshBooks: () => Promise<void>;
}

const BookContext = createContext<BookContextType>({
  books: [],
  filteredBooks: [],
  loading: false,
  filterStatus: "",
  searchQuery: "",
  setFilterStatus: () => {},
  setSearchQuery: () => {},
  clearFilters: () => {},
  addBook: async () => ({ error: null }),
  advanceStatus: async () => ({ error: null }),
  deleteBook: async () => ({ error: null }),
  refreshBooks: async () => {},
});

export function BookProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load books once when user logs in, and clear when user logs out
  useEffect(() => {
    if (!user) {
      setBooks([]);
      setFilterStatus("");
      setSearchQuery("");
      return;
    }

    let isMounted = true;
    const fetchBooks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (isMounted) {
        if (!error && data) {
          setBooks(data as Book[]);
        }
        setLoading(false);
      }
    };

    fetchBooks();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const refreshBooks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setBooks(data as Book[]);
    }
  };

  const addBook = async (bookData: {
    title: string;
    author: string;
    pages: number;
    status: "To Read" | "Reading" | "Finished";
  }) => {
    if (!user) {
      return { error: new Error("User not authenticated") };
    }

    const { data, error } = await supabase
      .from("books")
      .insert([
        {
          user_id: user.id,
          title: bookData.title.trim(),
          author: bookData.author.trim(),
          pages: bookData.pages,
          status: bookData.status,
        },
      ])
      .select()
      .single();

    if (error) {
      return { error: new Error(error.message) };
    }

    if (data) {
      // Add to list at once without reloading, most recently added first
      setBooks((prev) => [data as Book, ...prev]);
      return { error: null, data: data as Book };
    }

    return { error: null };
  };

  const advanceStatus = async (book: Book) => {
    let nextStatus: "To Read" | "Reading" | "Finished" = book.status;
    if (book.status === "To Read") {
      nextStatus = "Reading";
    } else if (book.status === "Reading") {
      nextStatus = "Finished";
    } else {
      return { error: null };
    }

    const { error } = await supabase
      .from("books")
      .update({ status: nextStatus })
      .eq("id", book.id);

    if (error) {
      return { error: new Error(error.message) };
    }

    // Advancing is saved in Supabase and the item updates at once
    setBooks((prev) =>
      prev.map((b) => (b.id === book.id ? { ...b, status: nextStatus } : b))
    );

    return { error: null };
  };

  const deleteBook = async (bookId: string) => {
    const { error } = await supabase.from("books").delete().eq("id", bookId);

    if (error) {
      return { error: new Error(error.message) };
    }

    // Delete removes book from list and from Supabase
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    return { error: null };
  };

  const clearFilters = () => {
    setFilterStatus("");
    setSearchQuery("");
  };

  // Filtered books logic:
  // "A status filter (All, or one of the three statuses) and a search box that keeps only books whose title
  // or author contains the typed text (not case-sensitive, spaces at both ends ignored). They combine (both must match)."
  // "When a book's status changes so that it no longer matches the status filter, it disappears from the list at once."
  const filteredBooks = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    return books.filter((book) => {
      // Status filter
      if (filterStatus && filterStatus !== "All" && book.status !== filterStatus) {
        return false;
      }

      // Search query filter (matches title or author, case-insensitive, trimmed)
      if (trimmedQuery) {
        const titleMatch = book.title.toLowerCase().includes(trimmedQuery);
        const authorMatch = book.author.toLowerCase().includes(trimmedQuery);
        if (!titleMatch && !authorMatch) {
          return false;
        }
      }

      return true;
    });
  }, [books, filterStatus, searchQuery]);

  return (
    <BookContext.Provider
      value={{
        books,
        filteredBooks,
        loading,
        filterStatus,
        searchQuery,
        setFilterStatus,
        setSearchQuery,
        clearFilters,
        addBook,
        advanceStatus,
        deleteBook,
        refreshBooks,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  return useContext(BookContext);
}

