
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store'
import { toast } from 'sonner'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(store => store.auth)
  const userProfile = user?.profile ?
    (typeof user.profile === 'string' ? JSON.parse(user.profile) : user.profile)
    : null;
  const [input, setInput] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: userProfile?.bio || '',
    skills: userProfile?.skills?.join(', ') || '',
    file: null,
    profilePhoto: null
  });

  
  const dispatch = useDispatch();


  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }



  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    const fieldName = e.target.name;

    if (fieldName === 'resume') {
      setInput({ ...input, file: file });
    } else if (fieldName === 'profilePhoto') {
      setInput({ ...input, profilePhoto: file });
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);

    // Convert skills back to array format
    const skillsArray = input.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    formData.append("skills", JSON.stringify(skillsArray));

    if (input.file) {
      formData.append("file", input.file);
    }
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      // Fixed error handling
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred while updating profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              Update your profile information and upload your resume or profile picture.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className='text-right'>Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={input.fullName}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className='text-right'>Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className='text-right'>Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className='text-right'>Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={input.bio}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className='text-right'>Skills</Label>
                <Input
                  id="skills"
                  name="skills"
                  placeholder="e.g. JavaScript, React, Node.js"
                  value={input.skills}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resume" className='text-right'>Resume</Label>
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="profilePhoto" className='text-right'>Profile Picture</Label>
                <Input
                  id="profilePhoto"
                  name="profilePhoto"
                  accept="image/*"
                  type="file"
                  onChange={fileChangeHandler}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              {
                loading ? (
                  <Button disabled className="w-full mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please Wait
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  >
                    Update
                  </Button>
                )
              }
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpdateProfileDialog
