import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='background-light850_dark100 relative'>
      <div className='flex'>
        <section className='max-md:pb-14 sm:px-14 flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36'>
          <div className='mx-auto w-full max-w-5xl'>{children}</div>
        </section>
      </div>
    </main>
  )
}
export default Layout
