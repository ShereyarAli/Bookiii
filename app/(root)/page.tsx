import React from 'react'
import Image from 'next/image'
import { sampleBooks } from '@/lib/constants'
import BookCard from '@/components/BookCard'

const page = () => {
  return (
    <main className="wrapper container">
      <section className="wrapper py-16 mb-10 md:mb-16">
        <div className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-soft-lg p-8 flex flex-col md:flex-row items-center gap-8">
          {/* left column */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-[var(--text-primary)]">
              Your Library
            </h1>
            <p className="mt-4 text-lg text-[var(--text-secondary)]">
              Convert your books into interactive AI conversations. Listen, learn, and discuss your favorite reads.
            </p>
            <button className="mt-6 inline-flex items-center px-6 py-3 bg-[var(--color-brand)] text-white rounded-full hover:bg-[var(--color-brand-hover)] transition">
              + Add new book
            </button>
          </div>

          {/* center illustration */}
          <div className="flex-1 flex justify-center">
            <Image
              src="/assets/_hero-illustration.png"
              alt="Vintage books and globe"
              width={300}
              height={200}
              className="object-contain"
            />
          </div>

          {/* right steps card */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="bg-white rounded-xl shadow-soft p-6 max-w-xs">
              <ol className="space-y-6 text-[var(--text-primary)]">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-[var(--bg-primary)] rounded-full flex items-center justify-center font-semibold text-sm">
                    1
                  </span>
                  <div className="ml-3">
                    <p className="font-medium">Upload PDF</p>
                    <p className="text-sm text-[var(--text-secondary)]">Add your book file</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-[var(--bg-primary)] rounded-full flex items-center justify-center font-semibold text-sm">
                    2
                  </span>
                  <div className="ml-3">
                    <p className="font-medium">AI Processing</p>
                    <p className="text-sm text-[var(--text-secondary)]">We analyze the content</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-[var(--bg-primary)] rounded-full flex items-center justify-center font-semibold text-sm">
                    3
                  </span>
                  <div className="ml-3">
                    <p className="font-medium">Voice Chat</p>
                    <p className="text-sm text-[var(--text-secondary)]">Discuss with AI</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <div className='library-books-grid'>
        {sampleBooks.map((book) => {
          return <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug = {book.slug} />;
        })}
      </div>
    </main>
  )
}

export default page