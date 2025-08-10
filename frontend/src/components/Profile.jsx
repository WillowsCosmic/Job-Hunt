import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import store from '@/redux/store'
import { USER_API_END_POINT } from '@/utils/constant'

// const skillArray = ["HTML", "CSS", "JS", "NodeJs", "ReactJs", "MySQL"];
const isResume = true;
const Profile = () => {
    const { user } = useSelector(store => store.auth)
    const [open, setOpen] = useState(false);

   
    const userProfile = user?.profile ?
        (typeof user.profile === 'string' ? JSON.parse(user.profile) : user.profile)
        : null;


    const BASE_URL = "http://localhost:3000"; 
    const getImageUrl = (path) => {
        if (!path) return null;
        
        const fullUrl = `${BASE_URL}${path}`;
        return fullUrl;
    };

    // Add loading check
    if (!user) {
        return (
            <div>
                <Navbar />
                <div className="max-w-4xl mx-auto p-8">
                    <div className="text-center">
                        <h2>Please log in to view your profile</h2>
                        <p>Redirecting to login...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />

            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                key={userProfile?.profilePhoto || Date.now()}
                                src={
                                    userProfile?.profilePhoto 
                                        ? getImageUrl(userProfile.profilePhoto)
                                        : "https://static.vecteezy.com/system/resources/previews/047/656/219/non_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg"
                                }
                                alt={user?.fullName || "Profile"}
                                onError={(e) => {
                                    console.log(" Image failed to load:", e.target.src);
                                    e.target.src = "https://static.vecteezy.com/system/resources/previews/047/656/219/non_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg";
                                }}
                                onLoad={() => {
                                    console.log(" Image loaded successfully!");
                                }}
                            />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullName || "No name"}</h1>
                            <p>{userProfile?.bio || "No bio available"}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right cursor-pointer" variant="outline">
                        <Pen />
                    </Button>
                </div>
                
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email || "No email"}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber || "No phone"}</span>
                    </div>
                </div>
                
                <div className='my-5'>
                    <h1 className='font-bold text-xl my-2'>Skills</h1>
                    <div className="flex gap-2 flex-wrap">
                        {
                            userProfile?.skills && Array.isArray(userProfile.skills) && userProfile.skills.length > 0 ?
                                userProfile.skills.map((item, index) =>
                                    <Badge key={index} variant={'ghost'} className="bg-[#6A38C2] hover:bg-[#b907ff] text-white">
                                        {item}
                                    </Badge>
                                ) : <span>No skills added</span>
                        }
                    </div>
                </div>
                
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        userProfile?.resume ? (
                            <a
                                target='_blank'
                                href={getImageUrl(userProfile.resume)}
                                className='text-blue-500 w-full hover:underline'
                                rel="noopener noreferrer"
                                onClick={() => {
                                    console.log("Resume clicked:", getImageUrl(userProfile.resume));
                                }}
                            >
                                📄 View Resume
                            </a>
                        ) : (
                            <span className="text-gray-500">No resume uploaded</span>
                        )
                    }
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8">
                <h1 className="text-xl font-bold mb-4">Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile