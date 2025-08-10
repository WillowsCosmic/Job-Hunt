import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const jobCompany = job?.companyInfo ?
        (typeof job.companyInfo === 'string' ? JSON.parse(job.companyInfo) : job.companyInfo)
        : null;

    const formatTimeAgo = (createdAt, options = {}) => {
        const {
            todayText = "Today",
            singularText = "day ago",
            pluralText = "days ago",
            unknownText = "Unknown"
        } = options;

        if (!createdAt) return unknownText;

        const created = new Date(createdAt);
        const currentTime = new Date();
        const timeDifference = currentTime - created;
        const daysAgo = Math.floor(timeDifference / (1000 * 24 * 60 * 60));

        if (daysAgo === 0) return todayText;
        if (daysAgo === 1) return `1 ${singularText}`;
        return `${daysAgo} ${pluralText}`;
    };
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-200'>
            <div className="flex items-center justify-between">
                <p className='text-sm text-gray-600'>
                    {formatTimeAgo(job?.createdAt, {
                        todayText: "Posted today",
                        singularText: "day ago",
                        pluralText: "days ago"
                    })}
                </p>
                <Button variant="outline" className={'rounded-full'} size='icon'><Bookmark /></Button>
            </div>
            <div className="flex items-center gap-2 m-2">
                <Button className='p-6' variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src="https://static.vecteezy.com/system/resources/previews/047/656/219/non_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg " />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{jobCompany?.name}</h1>
                    <p className='text-sm text-gray-600'>{job?.location}</p>
                </div>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold gap-4'} variant="ghost">{job?.position} Position</Badge>
                <Badge className={'text-red-600 font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#b907ff] font-bold'} variant="ghost">{job?.salary}</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={() => navigate(`/description/${job?.id}`)} variant="outline" className='border-gray-500 cursor-pointer'>Details</Button>
                <Button className='bg-violet-600 hover:bg-[#b907ff] cursor-pointer'>Save for later</Button>
            </div>
        </div>
    )
}

export default Job