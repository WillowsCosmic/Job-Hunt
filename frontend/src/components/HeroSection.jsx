import React from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'

const HeroSection = () => {
  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10">
        <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 Job Portal Website</span>
        <h1 className='font-serif text-5xl font-bold mt-6 text-slate-700'>Search, Apply & <br /> Get your <span className='text-[#b907ff] text-shadow-lg/30 text-shadow-violet-500'>Dream Jobs</span></h1>
        <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
          <input
            type="text"
            placeholder='Find your Dream Jobs'
            className='outline-none border-none w-full'
          />
          <Button className="rounded-r-full bg-[#6A38C2] hover:bg-[#b907ff] cursor-pointer h-12">
            <Search className='w-5 h-5'/>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection