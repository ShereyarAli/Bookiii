import z from 'zod';
import {
  MAX_FILE_SIZE,
  ACCEPTED_PDF_TYPES,
  MAX_IMAGE_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from './constants';

// Schema used by the book upload form (client side validation)
export const UploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author name is required'),
  persona: z.string().min(1, 'Please choose a voice'),
  pdfFile: z
    .instanceof(File, { message: 'A PDF file is required' })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max size is 50MB`)
    .refine((file) => ACCEPTED_PDF_TYPES.includes(file.type), 'Must be a PDF').optional(),
  coverImage: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, `Max size is 10MB`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Invalid image type'
    ),
});

export type UploadSchemaType = z.infer<typeof UploadSchema>;
