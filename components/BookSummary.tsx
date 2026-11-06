"use client";

import React, { useMemo } from "react";
import { useBooks } from "@/context/BookContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function BookSummary() {
  const { filteredBooks } = useBooks();

  const totalPages = useMemo(() => {
    return filteredBooks.reduce((sum, b) => sum + (Number(b.pages) || 0), 0);
  }, [filteredBooks]);

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const book of filteredBooks) {
      counts[book.status] = (counts[book.status] || 0) + 1;
    }
    // Only include statuses that actually appear (count > 0)
    // Keep deterministic order: 'To Read', 'Reading', 'Finished'
    const order = ["To Read", "Reading", "Finished"];
    return order
      .filter((status) => counts[status] && counts[status] > 0)
      .map((status) => ({
        status,
        count: counts[status],
      }));
  }, [filteredBooks]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Shelf Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <span className="text-xs text-muted-foreground block">Books</span>
            <span
              data-testid="Book-count"
              className="text-2xl font-bold"
            >
              <span data-testid="book-count">{filteredBooks.length}</span>
            </span>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <span className="text-xs text-muted-foreground block">Total Pages</span>
            <span data-testid="total-pages" className="text-2xl font-bold">
              {totalPages}
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Status Breakdown
          </span>
          <div data-testid="status-breakdown" className="space-y-2">
            {statusBreakdown.map((item) => (
              <div
                key={item.status}
                data-testid="breakdown-row"
                className="flex justify-between items-center text-sm py-1 border-b last:border-b-0"
              >
                <span data-testid="breakdown-name" className="font-medium">
                  {item.status}
                </span>
                <span
                  data-testid="breakdown-count"
                  className="px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground"
                >
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

