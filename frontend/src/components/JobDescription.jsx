import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import Navbar from './shared/Navbar';
import { useParams } from 'react-router-dom';
import { setSingleJob } from '@/redux/jobSlice';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const jobId = params.id;
  const {singleJob} = useSelector(store=>store.job)
  const {user} = useSelector(store=>store.auth)
  
  
  const jobApplication = singleJob?.applications || [];
  
 
  const checkIsApplied = (applications) => {
    if (!applications || !user?.id) return false;
    
    return applications.some(app => {
     
      if (typeof app === 'number') return app === user.id;
      return app.applicant === user.id || app.applicantInfo?.id === user.id;
    });
  };

  const [isApplied, setIsApplied] = useState(false);

  const applyJobHandler = async () => {
    try {
      console.log('Applying for job:', jobId);
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
      console.log('Apply response:', res.data);
      
      if(res.data.success){
        setIsApplied(true);
        toast.success(res.data.message);
        // Refresh the job data to get updated application list
        fetchSingleJobs();
      }
    } catch (error) {
      console.log('Apply error:', error);
      toast.error(error.response?.data?.message || 'Application failed');
    }
  }
  
  const fetchSingleJobs = async () => {
    try {
      console.log('Fetching job:', jobId);
      const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
      console.log('Fetch response:', res.data);
      
      if (res.data.success) {
        dispatch(setSingleJob(res.data.job));
        // ✅ FIXED - Check applications correctly
        const applications = res.data.job.applications || [];
        setIsApplied(checkIsApplied(applications));
      }
    } catch (error) {
      console.log('Fetch error:', error);
    }
  }
  
  useEffect(() => {
    fetchSingleJobs();
  }, [jobId, dispatch, user?.id])

  // ✅ ADDED - Loading state
  if (!singleJob) {
    return (
      <div>
        <Navbar />
        <div className='max-w-5xl mx-auto my-10'>
          <div>Loading job details...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className='max-w-5xl mx-auto my-10'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className="font-bold text-xl ">{singleJob?.title}</h1>
            <div className='flex items-center gap-2 mt-4'>
              <Badge className={'text-blue-700 font-bold gap-4'} variant="ghost">{singleJob?.position} Position</Badge>
              <Badge className={'text-red-600 font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
              <Badge className={'text-[#b907ff] font-bold'} variant="ghost">{singleJob?.salary} LPA</Badge>
            </div>
          </div>
          
          <Button 
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`rounded-lg ${
              isApplied 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-[#6A38C2] hover:bg-[#b907ff] cursor-pointer'
            }`}>
              {isApplied ? 'Already Applied' : 'Apply Now'}
          </Button>
        </div>
        
        <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
        <div>
          <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
          <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
          <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
          <h1 className='font-bold my-1'>Experience(in years): <span className='pl-4 font-normal text-gray-800'>{singleJob?.experienceLevel}</span></h1>
          <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary} LPA</span></h1>
          <h1 className='font-bold my-1'>Total Applicant: <span className='pl-4 font-normal text-gray-800'>{jobApplication?.length || 0}</span></h1>
          <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt?.split("T")[0]}</span></h1>
        </div>

        
      </div>
    </div>
  )
}

export default JobDescription