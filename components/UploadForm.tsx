'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadCloud, Image, X } from 'lucide-react';

import { voiceOptions, voiceCategories, DEFAULT_VOICE } from '@/lib/constants';
import { UploadSchema } from '@/lib/zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { checkBookExists, createBook, saveBookSegments } from '@/lib/actions/book.actions';
import { handleUpload, upload } from '@vercel/blob/client';
import { parsePDFFile } from '@/lib/utils';
import { BookUploadFormValues } from '@/types';

export default function UploadForm() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const router = useRouter()
  const {userId} = useAuth()
  type VoiceKey = keyof typeof voiceOptions;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(UploadSchema),
    defaultValues: { persona: DEFAULT_VOICE },
  });

  const selectedVoice = watch('persona');

  const onSubmit = async (data:BookUploadFormValues) => {
    // stubbed implementation - the caller can hook into this handler later
    console.log('form submit', data);
    if(!userId){
      toast.error('Please login to upload a book')
      return
    }
    if (!data.pdfFile) {
      toast.error('Please select a PDF file')
      return
    }
    // Normally you would upload files and create a book record here
    try {
      const existCheck = await checkBookExists(data.title)
      if(existCheck.exists && existCheck.book){
        toast.info('Book with same title already exists')
        // form.reset()
        router.push(`/books/${existCheck.book.slug}`)
        return
      }
      const fileTitle = data.title.replace(/\s+/g, '_').toLowerCase();
      const pdfFile = data.pdfFile as File;
      const parsedPDF  = await parsePDFFile(pdfFile)
      if(parsedPDF.content.length === 0){
        toast.error('Failed to parse PDF. Please try again with a different file.')
        return;
      }
      const uploadedPdfBlob = await upload(fileTitle, pdfFile,{
        access:'public',
        handleUploadUrl: '/api/upload',
        contentType: 'application/pdf'
      })
      let coverUrl: string
      if(data.coverImage){
        const coverFile = data.coverImage as File
        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, coverFile, {
          access:'public',
          handleUploadUrl:'/api/upload',
          contentType: coverFile.type
        })
        coverUrl = uploadedCoverBlob.url
      }
      else{
        const response = await fetch(parsedPDF.cover)
        const blob = await response.blob()
        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
          access:'public',
          handleUploadUrl:'/api/upload',
          contentType: 'image/png'
        })
        coverUrl = uploadedCoverBlob.url
      }
    
      const book = await createBook({
        clerkId: userId,
        title: data.title,
        author: data.author,
        persona: data.persona,
        fileURL: uploadedPdfBlob.url,
        fileBlobKey: uploadedPdfBlob.pathname,
        coverURL: coverUrl,
        fileSize: pdfFile.size,
      })
      if(!book.success) {
        toast.error(String(book.error))
        router.push('/subscriptions')
        return
      }
      if(book.alreadyExists){
        toast.info('Book already exists')
        router.push(`/books/${book.data.slug}`)
        return;
      }

    const segments = await saveBookSegments(book.data._id, userId, parsedPDF.content)
    if(!segments.success){
      const errorMsg = segments.error || 'Failed to save Book segments'
      toast.error(errorMsg)
      throw new Error(errorMsg)
    }
  router.push('/')
  }
  catch (error) {
      console.error( error);
      toast.error('failed to upload a book')
    }
  };

 const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;

  setPdfFile(file);

  if (file) {
    setValue("pdfFile", file);
  }
};

const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;
  setCoverFile(file);
  if (file) {
    setValue("coverImage", file);
  }
};

const removePdf = () => {
  setPdfFile(null);
  setValue("pdfFile", undefined);
};

const removeCover = () => {
  setCoverFile(null);
  setValue("coverImage", undefined);
};

  return (
    <div className="new-book-wrapper">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative">
        {/* PDF upload */}
        <div>
          <label
            htmlFor="pdf-input"
            className="upload-dropzone border-2 border-dashed border-gray-300"
          >
            {pdfFile ? (
              <div className="flex flex-col items-center justify-center">
                <span className="upload-dropzone-text">{pdfFile.name}</span>
                <X
                  className="upload-dropzone-remove mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePdf();
                  }}
                />
              </div>
            ) : (
              <>
                <UploadCloud className="upload-dropzone-icon" />
                <span className="upload-dropzone-text">
                  Click to upload PDF
                </span>
                <span className="upload-dropzone-hint">
                  PDF file (max 50MB)
                </span>
              </>
            )}
            <input
              id="pdf-input"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handlePdfChange}
            />
          </label>
          {errors.pdfFile && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pdfFile.message}
            </p>
          )}
        </div>

        {/* Cover upload */}
        <div>
          <label
            htmlFor="cover-input"
            className="upload-dropzone border-2 border-dashed border-gray-300"
          >
            {coverFile ? (
              <div className="flex flex-col items-center justify-center">
                <span className="upload-dropzone-text">{coverFile.name}</span>
                <X
                  className="upload-dropzone-remove mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCover();
                  }}
                />
              </div>
            ) : (
              <>
                <Image className="upload-dropzone-icon" />
                <span className="upload-dropzone-text">
                  Click to upload cover image
                </span>
                <span className="upload-dropzone-hint">
                  Leave empty to auto-generate from PDF
                </span>
              </>
            )}
            <input
              id="cover-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </label>
          {errors.coverImage && (
            <p className="text-red-500 text-sm mt-1">
              {errors.coverImage.message}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="form-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="ex: Rich Dad Poor Dad"
            className="form-input"
            {...register('title')}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Author */}
        <div>
          <label className="form-label" htmlFor="author">
            Author Name
          </label>
          <input
            id="author"
            type="text"
            placeholder="ex: Robert Kiyosaki"
            className="form-input"
            {...register('author')}
          />
          {errors.author && (
            <p className="text-red-500 text-sm mt-1">
              {errors.author.message}
            </p>
          )}
        </div>

        {/* Voice selector */}
        <div>
          <p className="form-label">Choose Assistant Voice</p>
          {Object.entries(voiceCategories).map(([groupName, ids]) => (
            <div key={groupName} className="mb-4">
              <p className="font-semibold capitalize mb-2">
                {groupName} Voices
              </p>
              <div className="voice-selector-options">
                {ids.map((id) => {
                const { name, description } = voiceOptions[id as keyof typeof voiceOptions];  
                const selected = selectedVoice === id;         
                  return (
                    <label
                      key={id}
                      className={`voice-selector-option ${
                        selected ? 'voice-selector-option-selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        className="hidden"
                        value={id}
                        {...register('persona')}
                      />
                      <div className="flex flex-col items-center">
                        <span>{name}</span>
                        <span className="text-sm text-gray-600">
                          {description}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          {errors.persona && (
            <p className="text-red-500 text-sm mt-1">
              {errors.persona.message}
            </p>
          )}
        </div>

        {/* submit */}
        <button type="submit" className="form-btn" disabled={isSubmitting}>
          Begin Synthesis
        </button>
      </form>

      {isSubmitting && (
        <div className="loading-wrapper">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
        </div>
      )}
    </div>
  );
}

