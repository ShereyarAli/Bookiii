'use server'


import { connectToDB } from "@/db/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "../utils";
import Book from "@/db/models/book.model";
import { success } from "zod";
import BookSegment from "@/db/models/bookSegment.model";
import { setErrorMap } from "zod/v3";




export const checkBookExists = async (title:string) =>{
  try {
    await connectToDB()
    const slug = generateSlug(title)
    const existingBook  = await Book.findOne({ slug }).lean()
    if(existingBook){
      return{
        exists:true,
        book:serializeData(existingBook)
      }
    }
    return{exists:false}
  } catch (error) {
    console.error('Error checking book existence:', error);
    return {
      exists: false,
      error
    }
  }
}


export const createBook = async (data: CreateBook) => {
  try {
    await connectToDB()
    const slug = generateSlug(data.title);
    const existingBook = await Book.findOne({ slug}).lean()

    if (existingBook) {
      return{
        success:true,
        data:serializeData(existingBook),
        alreadyExists: true,
      }
    }
      const book = await Book.create({...data, slug, totalSegments:0})

    }
 catch (e) {  
  console.error('Error creating book:', e);
  return {
    success: false,
    error: e
  }
}
}

export const saveBookSegments = async (bookId: string,clerkId:string, segments:TextSegment[]) => {
  try {
    await connectToDB()
    const segmentsToInsert = segments.map(({text, segmentIndex, pageNumber, wordCount})=>({
      clerkId, bookId, content:text, segmentIndex, pageNumber, wordCount
    }));
    await BookSegment.insertMany(segmentsToInsert)
    await Book.findByIdAndUpdate(bookId, { totalSegments: segmentsToInsert.length })
    console.log('Book segments saved successfully')
    return{
      success:true,
      data:{segmentsCreated: segments.length}
    }
  }
  catch (e) {
    console.error('Error saving book segments:', e);
    return {  
      success: false,
      error: e
    }
  }
}