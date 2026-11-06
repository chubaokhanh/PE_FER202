"use client";

import React, { useState } from "react";
import { useBooks } from "@/context/BookContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function BookForm() {
  const { addBook } = useBooks();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [status, setStatus] = useState<string>("");

  const [errors, setErrors] = useState<{
    title?: string;
    author?: string;
    pages?: string;
    status?: string;
    submit?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (t: string, a: string, p: string, s: string) => {
    const errs: {
      title?: string;
      author?: string;
      pages?: string;
      status?: string;
    } = {};

    // Title: empty or spaces only / longer than 80 characters
    if (!t.trim()) {
      errs.title = "Title is required";
    } else if (t.length > 80) {
      errs.title = "Title must be at most 80 characters";
    }

    // Author: empty or spaces only / longer than 60 characters
    if (!a.trim()) {
      errs.author = "Author is required";
    } else if (a.length > 60) {
      errs.author = "Author must be at most 60 characters";
    }

    // Pages: empty / not a whole number from 1 to 5000
    if (!p.trim()) {
      errs.pages = "Pages is required";
    } else {
      const isWholeNumber = /^\d+$/.test(p.trim());
      const num = Number(p.trim());
      if (!isWholeNumber || num < 1 || num > 5000) {
        errs.pages = "Pages must be a whole number between 1 and 5000";
      }
    }

    // Status: nothing chosen
    if (!s) {
      errs.status = "Please choose a status";
    }

    return errs;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (isSubmitted) {
      const v = validate(val, author, pages, status);
      setErrors((prev) => ({ ...prev, title: v.title, submit: undefined }));
    }
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAuthor(val);
    if (isSubmitted) {
      const v = validate(title, val, pages, status);
      setErrors((prev) => ({ ...prev, author: v.author, submit: undefined }));
    }
  };

  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPages(val);
    if (isSubmitted) {
      const v = validate(title, author, val, status);
      setErrors((prev) => ({ ...prev, pages: v.pages, submit: undefined }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStatus(val);
    if (isSubmitted) {
      const v = validate(title, author, pages, val);
      setErrors((prev) => ({ ...prev, status: v.status, submit: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setSuccessMessage(null);

    const validationErrors = validate(title, author, pages, status);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const result = await addBook({
      title,
      author,
      pages: parseInt(pages.trim(), 10),
      status: status as "To Read" | "Reading" | "Finished",
    });

    setIsSubmitting(false);

    if (result.error) {
      setErrors({ submit: result.error.message });
    } else {
      // Clear form and show success message
      setTitle("");
      setAuthor("");
      setPages("");
      setStatus("");
      setIsSubmitted(false);
      setSuccessMessage("Book added");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Book</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          data-testid="book-form"
          noValidate
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {successMessage && (
            <div
              data-testid="book-success"
              className="p-3 text-sm text-green-700 bg-green-50 rounded-md border border-green-200"
            >
              <span data-testid="expense-success">{successMessage}</span>
            </div>
          )}

          {errors.submit && (
            <div
              data-testid="error-book"
              className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20"
            >
              <span data-testid="error-expense">{errors.submit}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="input-title">Title</Label>
            <Input
              id="input-title"
              data-testid="input-title"
              type="text"
              placeholder="e.g. Clean Code"
              value={title}
              onChange={handleTitleChange}
            />
            {errors.title && (
              <p data-testid="error-title" className="text-sm text-destructive">
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="input-author">Author</Label>
            <Input
              id="input-author"
              data-testid="input-author"
              type="text"
              placeholder="e.g. Robert C. Martin"
              value={author}
              onChange={handleAuthorChange}
            />
            {errors.author && (
              <p data-testid="error-author" className="text-sm text-destructive">
                {errors.author}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="input-pages">Number of Pages</Label>
            <Input
              id="input-pages"
              data-testid="input-pages"
              type="text"
              placeholder="e.g. 464"
              value={pages}
              onChange={handlePagesChange}
            />
            {errors.pages && (
              <p data-testid="error-pages" className="text-sm text-destructive">
                {errors.pages}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="select-status">Status</Label>
            <select
              id="select-status"
              data-testid="select-status"
              value={status}
              onChange={handleStatusChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Choose status</option>
              <option value="To Read">To Read</option>
              <option value="Reading">Reading</option>
              <option value="Finished">Finished</option>
            </select>
            {errors.status && (
              <p data-testid="error-status" className="text-sm text-destructive">
                {errors.status}
              </p>
            )}
          </div>

          <Button
            type="submit"
            data-testid="btn-add-book"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Book"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

