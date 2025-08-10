import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux' 

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth); 
    
    useEffect(() => {
        const fetchAllJobs = async () => {
            if (!user) {
                return;
            }

            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`, {
                    withCredentials: true
                });
                
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(' Error fetching jobs:', error);
                
                
                if (error.response?.status === 401) {
                    console.log('🔒 Authentication expired, please login again');
                    
                    dispatch(setAllJobs([]));
                }
            }
        }
        
        fetchAllJobs();
    }, [user]); 
}

export default useGetAllJobs