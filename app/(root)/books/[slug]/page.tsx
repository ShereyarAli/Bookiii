import { auth } from "@clerk/nextjs/server";
import { getBookBySlug } from "@/lib/actions/book.actions";
import { redirect } from "next/navigation";
import { MicOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function BookPage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const { slug } = await params;
  const { success, data: book } = await getBookBySlug(slug);
  console.log('Fetched book:', book, userId);
  if (!success || !book) {
    redirect("/");
  }

  return (
    <div className="book-page-container">
      {/* Floating back button */}
      <Link href="/" className="back-btn-floating">
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header card */}
        <div className="vapi-header-card">
          <div className="flex items-center gap-6">
            {/* Book cover with mic button */}
            <div className="relative">
              <img
                src={book.coverURL || "/default-cover.jpg"}
                alt={book.title}
                className="w-30 h-auto rounded-lg shadow-lg"
              />
              <button className="vapi-mic-btn absolute -bottom-3 -right-3">
                <MicOff className="w-6 h-6" />
              </button>
            </div>

            {/* Book info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold font-serif mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                by {book.author}
              </p>

              {/* Badges */}
              <div className="flex gap-2">
                <div className="vapi-status-indicator">
                  <div className="vapi-status-dot vapi-status-dot-ready"></div>
                  <span className="vapi-status-text">Ready</span>
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-sm font-medium">
                  Voice: {book.persona}
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-sm font-medium">
                  0:00/15:00
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript area */}
        <div className="transcript-container">
          <div className="transcript-empty">
            <MicOff className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <div className="transcript-empty-text">No conversation yet</div>
            <div className="transcript-empty-hint">
              Click the mic button above to start talking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}