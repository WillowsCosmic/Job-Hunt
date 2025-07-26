
import React from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

const Signup = () => {
    return (
        <>
            <div><Navbar /></div>
            <div className='flex min-h-screen'>
                {/* Form Section */}
                <div className='flex items-center justify-center w-full lg:w-1/2 p-8'>
                    <form className='w-full max-w-md border border-gray-300 rounded-md shadow-lg p-6'>
                        <h1 className="font-bold text-xl mb-5 text-center">
                            <span className='text-[#b907ff]'>Sign</span>{' '}
                            <span className='text-[#0066ff]'>Up</span>
                        </h1>
                        
                        <div className="mb-4">
                            <Label className="block mb-2">Full Name</Label>
                            <Input
                                type="text"
                                placeholder="Full Name"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <Label className="block mb-2">Email</Label>
                            <Input
                                type="email"
                                placeholder="example@email.com"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <Label className="block mb-2">Phone number</Label>
                            <Input
                                type="text"
                                placeholder="Phone Number"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <Label className="block mb-2">Password</Label>
                            <Input
                                type="password"
                                placeholder="Password"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <Label className="block mb-2">Role</Label>
                            <RadioGroup defaultValue="student" className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="student" id="student" />
                                    <Label htmlFor="student">Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="recruiter" id="recruiter" />
                                    <Label htmlFor="recruiter">Recruiter</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        
                        <div className="mb-6">
                            <Label className="block mb-2">Profile Picture</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                className="cursor-pointer"
                            />
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="w-full mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                        >
                            Signup
                        </Button>
                        
                        <div className="text-center">
                            <span className='text-sm'>
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-400 hover:underline">
                                    Click here to Login
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
                
                {/* Image Section */}
                <div className='hidden lg:block lg:w-1/2'>
                    <img
                        src='../assets/image/side-img.jpeg'
                        alt="Signup illustration"
                        className='h-full w-full object-cover'
                    />
                </div>
            </div>
        </>
    )
}

export default Signup
