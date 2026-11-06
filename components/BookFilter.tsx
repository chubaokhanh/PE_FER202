"use client";

import React from "react";
import { useBooks } from "@/context/BookContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BookFilter() {
  const { filterStatus, searchQuery, setFilterStatus, setSearchQuery, clearFilters } =
    useBooks();

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      <div className="w-full sm:w-48">
        <select
          data-testid="filter-status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All</option>
          <option value="To Read">To Read</option>
          <option value="Reading">Reading</option>
          <option value="Finished">Finished</option>
        </select>
      </div>

      <div className="relative flex-1">
        <Input
          data-testid="search-input"
          type="text"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          data-testid="aearch-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      <Button
        variant="outline"
        data-testid="btn-clear-filters"
        onClick={clearFilters}
        type="button"
      >
        Clear
      </Button>
    </div>
  );
}

