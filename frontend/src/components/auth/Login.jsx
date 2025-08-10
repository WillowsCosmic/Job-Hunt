import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import { setLoading, setUser } from '@/redux/authSlice.js'

const Login = () => {
    const [input, setinput] = useState({
        email: "",
        password: "",
        role: "",
    });

    const {loading} = useSelector(store=>store.auth)
    const dispatch = useDispatch(); 
    const navigate = useNavigate();

    const changedEventHandler = (e) => {
        setinput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                navigate("/")
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally {
            dispatch(setLoading(false))
        }
    }


    return (
        <>
            <div className='fixed top-0 left-0 right-0 z-50 bg-white shadow-sm'><Navbar /></div>
            <div className='flex min-h-screen'>
                {/* Form Section */}
                <div className='flex items-center justify-center w-full lg:w-1/2 p-8'>
                    <form onSubmit={submitHandler} className='w-full max-w-md border border-gray-300 rounded-md shadow-lg p-6'>
                        <h1 className="font-bold text-xl mb-5 text-center">
                            <span className='text-[#b907ff]'>Log</span>{' '}
                            <span className='text-[#0066ff]'>In</span>
                        </h1>


                        <div className="mb-4">
                            <Label className="block mb-2">Email</Label>
                            <Input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changedEventHandler}
                                placeholder="example@email.com"
                            />
                        </div>


                        <div className="mb-4">
                            <Label className="block mb-2">Password</Label>
                            <Input
                                type="password"
                                value={input.password}
                                name="password"
                                onChange={changedEventHandler}
                                placeholder="Password"
                            />
                        </div>

                        <div className="mb-4">
                            <Label className="block mb-2">Role</Label>
                            <RadioGroup defaultValue="student" className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changedEventHandler}
                                        className="cursor-pointer"
                                    />
                                    <Label htmlFor="student">Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === 'recruiter'}
                                        onChange={changedEventHandler}
                                        className="cursor-pointer"
                                    />
                                    <Label htmlFor="recruiter">Recruiter</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {
                            loading ? <Button className="w-full mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please Wait</Button> : <Button
                            type="submit"
                            className="w-full mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                        >
                            Login
                        </Button>
                        }


                        

                        <div className="text-center">
                            <span className='text-sm'>
                                Dont have an account?{' '}
                                <Link to="/signup" className="text-blue-400 hover:underline">
                                    Click here to Signup
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>

                {/* Image Section */}
                <div className='hidden lg:block lg:w-1/2'>
                    <img
                        src='../assets/image/side-img.jpeg'
                        alt="Login illustration"
                        className='w-full'
                    />
                </div>
            </div>
        </>
    )
}

export default Login