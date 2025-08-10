
import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { USER_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { toast } from 'sonner'
import { Formik } from 'formik'
import * as Yup from "yup"
import { useDispatch, useSelector } from 'react-redux' // Add useSelector here
import { setLoading } from '@/redux/authSlice.js'
import { Loader2 } from 'lucide-react' // Add this import

let regex = '/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i';
const passwordRules = /^(?=.\d)(?=.[a-z])(?=.*[A-Z]).{8,}$/;
const SignUpSchema = Yup.object().shape({
    username: Yup.string("Enter your Username")
    .min(8, "Username should be of minimum 8 characters length")
    .required("Username is required")
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
    email: Yup.string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Invalid Email"),
    
    
    
    password: Yup
      .string("Enter your password")
      .matches(passwordRules, { message: "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character" })
      .required("Password is required")
  });
const Signup = () => {
    const initialFormValues = {
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    };
    const [input, setinput] = useState(initialFormValues);

    const {loading} = useSelector(store=>store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const changedEventHandler = (e) => {
        setinput({ ...input, [e.target.name]: e.target.value });
    }

    const changedFileHandler = (e) => {
        setinput({ ...input, file: e.target.files?.[0] })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullName",input.fullName)
        formData.append("email",input.email)
        formData.append("phoneNumber",input.phoneNumber)
        formData.append("password",input.password)
        formData.append("role",input.role)
        if(input.file){
            formData.append("file",input.file)
        }

        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${USER_API_END_POINT}/register`,formData,{
                headers: {
                    "Content-type":"multipart/form-data"
                },
                withCredentials:true,
            });
            if(res.data.success){
                navigate("/login")
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
                            <span className='text-[#b907ff]'>Sign</span>{' '}
                            <span className='text-[#0066ff]'>Up</span>
                        </h1>

                        <div className="mb-4">
                            <Label className="block mb-2">Full Name</Label>
                            <Input
                                type="text"
                                value={input.fullName}
                                name="fullName"
                                onChange={changedEventHandler}
                                placeholder="Full Name"
                            />
                        </div>

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
                            <Label className="block mb-2">Phone number</Label>
                            <Input
                                type="text"
                                value={input.phoneNumber}
                                name="phoneNumber"
                                onChange={changedEventHandler}
                                placeholder="Phone Number"
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

                        <div className="mb-6">
                            <Label className="block mb-2">Profile Picture</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changedFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                        {
                            loading ? <Button className="w-full mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please Wait</Button> : <Button
                            type="submit"
                            className="w-full mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                        >
                            Signup
                        </Button>
                        }

                        

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
                        className='w-full'
                    />
                </div>
            </div>
        </>
    )
}

export default Signup
