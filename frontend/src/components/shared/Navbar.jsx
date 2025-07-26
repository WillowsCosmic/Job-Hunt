import React from 'react'
import { Link } from 'react-router-dom'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover.jsx'
import { Button } from '../ui/button.jsx'
import { Avatar, AvatarImage } from '../ui/avatar.jsx'
import { LogOut, User2 } from 'lucide-react'
const Navbar = () => {
    const user = false;
    return (
        <div className='bg-white'>
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
                <div>
                    <h1 className='text-2xl font-bold text-[#b907ff] text-shadow-lg/30 text-shadow-violet-500'>JOB<span className='text-[#0066ff] text-shadow-lg/30 text-shadow-blue-600'>HUNT</span></h1>
                </div>
                <div className="flex items-center gap-12">
                    <ul className='flex font-medium items-center gap-5'>
                        {/* <li><Link>Home</Link></li>
                <li><Link>Jobs</Link></li>
                <li><Link>Browse</Link></li> */}
                        <li>Home</li>
                        <li>Jobs</li>
                        <li>Browse</li>
                    </ul>
                    {
                        !user?(
                            <div className="flex items-center gap-2">
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg=[#5b30a6]">Signup</Button></Link>                                
                            </div>
                        ) :( 
                    <Popover>
                        <PopoverTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src="https://github.com/WillowsCosmic.png" alt="@shadcn" />
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="flex gap-4 space-y-2">
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src="https://github.com/WillowsCosmic.png" alt="@shadcn" />
                                </Avatar>
                                <div>
                                    <h4 className="font-medium">Purbali MernStacks</h4>
                                    <p className="text-sm text-muted-foreground">Aspiring Software developer</p>
                                </div>
                            </div>
                            <div className="flex flex-col text-gray-600 my-2">
                                <div className="flex w-fit items-center gap-2 cursor">
                                    <User2 />
                                    <Button variant="link">View Profile</Button>
                                </div>
                                <div className="flex w-fit items-center gap-2 cursor">
                                    <LogOut />
                                    <Button variant="link">Logout</Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar