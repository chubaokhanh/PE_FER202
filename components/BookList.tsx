"use client";

import React, { useState } from "react";
import { Book, useBooks } from "@/context/BookContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trash2, BookOpen } from "lucide-react";

export function BookList() {
  const { filteredBooks, advanceStatus, deleteBook } = useBooks();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdvance = async (book: Book) => {
    setUpdatingId(book.id);
    await advanceStatus(book);
    setUpdatingId(null);
  };

  const handleDelete = async (bookId: string) => {
    setDeletingId(bookId);
    await deleteBook(bookId);
    setDeletingId(null);
  };

  if (filteredBooks.length === 0) {
    return (
      <div
        data-testid="book-empty"
        className="flex flex-col items-center justify-center p-12 border rounded-lg bg-card text-center"
      >
        <BookOpen className="w-12 h-12 text-muted-foreground/50 mb-3" />
        <p data-testid="books-empty" className="text-lg font-medium text-muted-foreground">
          No books found
        </p>
      </div>
    );
  }

  return (
    <div data-testid="book-list" className="space-y-3">
      {filteredBooks.map((book) => (
        <Card key={book.id} data-testid="book-item" className="overflow-hidden">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 min-w-0 flex-1">
              <div data-testid="Book-title" className="text-lg font-semibold truncate">
                <span data-testid="book-title">{book.title}</span>
              </div>
              <p data-testid="book-author" className="text-sm text-muted-foreground truncate">
                {book.author}
              </p>
              <div className="flex items-center gap-3 pt-1 text-sm">
                <span
                  data-testid="book-pages"
                  className="font-medium text-foreground/80"
                >
                  {book.pages} pages
                </span>
                <span>•</span>
                <span
                  data-testid="book-status"
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    book.status === "Finished"
                      ? "bg-green-100 text-green-800"
                      : book.status === "Reading"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {book.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {book.status !== "Finished" && (
                <Button
                  size="sm"
                  variant="outline"
                  data-testid="btn-advance-status"
                  disabled={updatingId === book.id}
                  onClick={() => handleAdvance(book)}
                  className="flex items-center gap-1"
                >
                  <span>Advance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}

              <Button
                size="sm"
                variant="destructive"
                data-testid="btn-delete-book"
                disabled={deletingId === book.id}
                onClick={() => handleDelete(book.id)}
                className="flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

