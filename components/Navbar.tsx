'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import  logoImage from '../assets/logo.png'
 const Navbar = () => {
  const navItems = [
    {label:'Library', href:'/'},
    {label:'Add new', href:'/books/new'},
  ]
  const pathName = usePathname()
  return (
    <>
    <header className="w-full fixed z-50 bg-[var(--bg-primary)]">
      <div className='wrapper navbar-height py-4 flex justify-between items-center'>
        <Link href ="/" className='flex gap-0.5 items-center'>
          <Image src={logoImage} width={42} height = {26} alt='Bookified' />
          <span className='logo-text'>Bookified</span>
        </Link>
        <nav className='w-fit flex gap-7.5 items-center'>
        {navItems.map(({label,href}) => {
          const isActive = pathName === href ||(href !=='/' && pathName.startsWith(href))

          return(
            <Link key={href} href={href} className={cn('nav-link-base', isActive ? 'nav-link-active':'text-black hover:opacity-70')}>
              {label}
            </Link>
          )
        })}
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
        </nav>
      </div>
  </header>
  </>
  )
}
 export default Navbar