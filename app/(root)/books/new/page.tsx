import UploadForm from '@/components/UploadForm'

export const dynamic = 'force-dynamic'

const Page = () => {
  return (
    <main className="wrapper container">
      <div className='mx-auto max-w-180 space-y-10'>
        <section className='flex flex-col gap5'>
          <h1 className='page-title-xl'>Add a new book</h1>
          <p className='subtitle'>Upload a PDF to generate your interactive interview</p>
        </section>
        <UploadForm />
      </div>
    </main>
  )
}

export default Page