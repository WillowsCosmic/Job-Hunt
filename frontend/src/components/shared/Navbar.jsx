
import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover.jsx'
import { Button } from '../ui/button.jsx'
import { Avatar, AvatarImage } from '../ui/avatar.jsx'
import { LogOut, User2, Menu, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store.js'
import { USER_API_END_POINT } from '@/utils/constant.js'
import axios from 'axios'
import { toast } from 'sonner'
import { setUser } from '@/redux/authSlice.js'

const Navbar = () => {

    const { user } = useSelector(store => store.auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const BASE_URL = "http://localhost:3000";
    const userProfile = user?.profile ?
        (typeof user.profile === 'string' ? JSON.parse(user.profile) : user.profile)
        : null;
    const getImageUrl = (path) => {
        if (!path) return null;

        const fullUrl = `${BASE_URL}${path}`;
        return fullUrl;
    };

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, {
                withCredentials: true
            });

            if (res.data.success) {
                // Clear Redux state
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            dispatch(setUser(null));

            // Force clear cookies
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            navigate("/");
            toast.success("Logged out successfully");
        }
    }
    return (
        <div className='bg-white'>
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                <div>
                    <h1 className='text-2xl font-bold text-[#b907ff] text-shadow-lg/30 text-shadow-violet-500'>JOB<span className='text-[#0066ff] text-shadow-lg/30 text-shadow-blue-600'>HUNT</span></h1>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden sm:flex items-center gap-12">
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li className="cursor-pointer hover:text-[#6A38C2] transition-colors">
                                        <Link to="/admin/companies">Companies</Link>
                                    </li>
                                    <li className="cursor-pointer hover:text-[#6A38C2] transition-colors">
                                        <Link to="/admin/jobs">Jobs</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="cursor-pointer hover:text-[#6A38C2] transition-colors">
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li className="cursor-pointer hover:text-[#6A38C2] transition-colors">
                                        <Link to="/jobs">Jobs</Link>
                                    </li>
                                    <li className="cursor-pointer hover:text-[#6A38C2] transition-colors">
                                        <Link to="/browse">Browse</Link>
                                    </li>
                                </>

                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="outline">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage
                                            key={userProfile?.profilePhoto || Date.now()}
                                            src={
                                                userProfile?.profilePhoto
                                                    ? getImageUrl(userProfile.profilePhoto)
                                                    : "https://static.vecteezy.com/system/resources/previews/047/656/219/non_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg"
                                            }
                                            alt={user?.fullName || "Profile"}
                                            onError={(e) => {
                                                console.log("Image failed to load:", e.target.src);
                                                e.target.src = "https://static.vecteezy.com/system/resources/previews/047/656/219/non_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg";
                                            }}
                                            onLoad={() => {
                                                console.log("Image loaded successfully!");
                                            }}
                                        />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="flex gap-4 space-y-2">
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage
                                                key={userProfile?.profilePhoto || Date.now()}
                                                src={
                                                    userProfile?.profilePhoto
                                                        ? getImageUrl(userProfile.profilePhoto)
                                                        : "https://static.vecteezy.com/system/resources/previews/047/656/219/non_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg"
                                                }
                                                alt={user?.fullName || "Profile"}
                                                onError={(e) => {
                                                    console.log("❌ Image failed to load:", e.target.src);
                                                    e.target.src = "https://static.vecteezy.com/system/resources/previews/047/656/219/non_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg";
                                                }}
                                                onLoad={() => {
                                                    console.log("✅ Image loaded successfully!");
                                                }}
                                            />
                                        </Avatar>
                                        <div>
                                            <h4 className="font-medium">{user?.fullName}</h4>
                                            <p className="text-sm text-muted-foreground">{userProfile?.bio}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-gray-600 my-2">
                                        {
                                            user && user.role === 'recruiter' ? (
                                                <div className="flex w-fit items-center gap-2 cursor-pointer">
                                                    <LogOut />
                                                    <Button onClick={logoutHandler} variant="link">Logout</Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                                                        <User2 />
                                                        <Button variant="link"><Link to="/profile">View Profile</Link></Button>
                                                    </div>
                                                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                                                        <LogOut />
                                                        <Button onClick={logoutHandler} variant="link">Logout</Button>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>

                {/* Mobile Menu Button */}
                <div className="sm:hidden">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleMobileMenu}
                        className="p-2"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="sm:hidden bg-white border-t border-gray-200 shadow-lg">
                    <div className="px-4 py-2 space-y-1">
                        <ul className='flex flex-col font-medium items-center gap-5'>

                            {
                                user && user.role === 'recruiter' ? (
                                    <>
                                        <li className="cursor-pointer hover:text-[#6A38C2] transition-colors">
                                            <Link to="/admin/companies">Companies</Link>
                                        </li>
                                        <li className="cursor-pointer hover:text-[#6A38C2] transition-colors">
                                            <Link to="/admin/jobs">Jobs</Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="cursor-pointer hover:text-[#6A38C2] transition-colors">
                                            <Link to="/">Home</Link>
                                        </li>
                                        <li className="cursor-pointer hover:text-[#6A38C2] transition-colors">
                                            <Link to="/jobs">Jobs</Link>
                                        </li>
                                        <li className="cursor-pointer hover:text-[#6A38C2] transition-colors">
                                            <Link to="/browse">Browse</Link>
                                        </li>
                                    </>

                                )
                            }
                        </ul>

                        {/* Mobile Auth Buttons */}
                        <div className="pt-4 pb-2 border-t border-gray-200 mt-4">
                            {!user ? (
                                <div className="space-y-2">
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full">Login</Button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 px-3 py-2">
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage
                                                key={userProfile?.profilePhoto || Date.now()}
                                                src={
                                                    userProfile?.profilePhoto
                                                        ? getImageUrl(userProfile.profilePhoto)
                                                        : "https://static.vecteezy.com/system/resources/previews/047/656/219/non_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg"
                                                }
                                                alt={user?.fullName || "Profile"}
                                                onError={(e) => {
                                                    console.log("❌ Image failed to load:", e.target.src);
                                                    e.target.src = "https://static.vecteezy.com/system/resources/previews/047/656/219/non_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg";
                                                }}
                                                onLoad={() => {
                                                    console.log("✅ Image loaded successfully!");
                                                }}
                                            />
                                        </Avatar>
                                        <div>
                                            <h4 className="font-medium">{user?.fullName}</h4>
                                            <p className="text-sm text-muted-foreground">{userProfile?.bio}</p>
                                        </div>
                                    </div>
                                    {

                                        user && user.role === 'recruiter' ? (
                                            <div className="flex w-fit items-center gap-2 cursor-pointer">
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link">Logout</Button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex w-fit items-center gap-2 cursor-pointer">
                                                    <User2 />
                                                    <Button variant="link"><Link to="/profile">View Profile</Link></Button>
                                                </div>
                                                <div className="flex w-fit items-center gap-2 cursor-pointer">
                                                    <LogOut />
                                                    <Button onClick={logoutHandler} variant="link">Logout</Button>
                                                </div>
                                            </>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar
