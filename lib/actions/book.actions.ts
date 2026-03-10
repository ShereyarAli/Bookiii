'use server'


import { connectToDB } from "@/db/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "../utils";
import Book from "@/db/models/book.model";
import { success } from "zod";
import BookSegment from "@/db/models/bookSegment.model";
import { setErrorMap } from "zod/v3";
import { Types } from "mongoose";




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
    return {
      success: true,
      data: serializeData(book)
    }
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
      clerkId, bookId: new Types.ObjectId(bookId), content:text, segmentIndex, pageNumber, wordCount
    }));
    await BookSegment.insertMany(segmentsToInsert)
    await Book.findByIdAndUpdate(new Types.ObjectId(bookId), { totalSegments: segmentsToInsert.length })
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
      error: e instanceof Error ? e.message : String(e)
    }
  }
}

export const getAllBooks = async () => {
  try {
    await connectToDB()
    const books = await Book.find().sort({ createdAt: -1 }).lean()
    return {
      success: true,
      data: serializeData(books)
    }
  }
  catch(e){
    console.error('Error fetching books:', e);
    return {
      success: false,
      error: e
    }
  }
}

export const getBookBySlug = async (slug: string) => {
  try {
    await connectToDB()
    const book = await Book.findOne({ slug }).lean()
    if (!book) {
      return {
        success: false,
        data: null
      }
    }
    return {
      success: true,
      data: serializeData(book)
    }
  }
  catch(e){
    console.error('Error fetching book by slug:', e);
    return {
      success: false,
      error: e
    }
  }
}