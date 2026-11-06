import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookPlus, BarChart3, Search } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center space-y-4 mb-12">
        <h1 data-testid="home-title" className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          ShelfLife
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Keep track of books you want to read, are currently reading, or have finished.
          Measure your reading habits and organize your personal library with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <BookPlus className="w-5 h-5" />
            </div>
            <CardTitle>Add books</CardTitle>
            <CardDescription>
              Quickly catalog books by title, author, and number of pages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Keep your entire reading wishlist organized in one secure place with customized statuses.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <BarChart3 className="w-5 h-5" />
            </div>
            <CardTitle>Track your progress</CardTitle>
            <CardDescription>
              Advance status from To Read to Reading to Finished.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor your total pages read and see real-time breakdowns of books in each stage.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Search className="w-5 h-5" />
            </div>
            <CardTitle>Search your shelf</CardTitle>
            <CardDescription>
              Instant search and status filtering for any book.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Filter by reading status or search by title and author without page reloads.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

