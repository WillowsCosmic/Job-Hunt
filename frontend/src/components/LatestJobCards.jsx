import React from 'react'
import { Badge } from './ui/badge'



const LatestJobCards = ({job}) => {
    const jobCompany = job?.companyInfo ?
    (typeof job.companyInfo === 'string' ? JSON.parse(job.companyInfo) : job.companyInfo)
    : null;
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-200 cursor-pointer hover:shadow-md hover:shadow-[#b907ff] hover:border-[#b907ff]'>
            <div>
                <h1 className='font-medium text-lg'>{jobCompany?.name}</h1>
                <p className='text-sm text-gray-500'>{job?.location}</p>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold gap-4'} variant="ghost">{job?.position} Position</Badge>
                <Badge className={'text-red-600 font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#b907ff] font-bold'} variant="ghost">{job?.salary}</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards