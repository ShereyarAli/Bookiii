import { auth } from "@clerk/nextjs/server";
import { getBookBySlug } from "@/lib/actions/book.actions";
import { redirect } from "next/navigation";
import { MicOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import VapiControls from "@/components/VapiControls";

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
  const book = await getBookBySlug(slug);
  // console.log('Fetched book:', book, userId);
  if (!book.success || !book) {
    redirect("/");
  }
  
  return (
    <>
    <div className="book-page-container">
      {/* Floating back button */}
      <Link href="/" className="back-btn-floating">
        <ArrowLeft className="w-5 h-5" />
      </Link>
        {/* Transcript area */}
        <VapiControls book ={book.data}/>
      </div>
    </>
      );
}