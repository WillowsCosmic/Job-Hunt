import { Job, Company, Application, User } from "../models/associations.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        
        console.log('🔍 Applying job - User ID:', userId, 'Job ID:', jobId);
        
        if (!jobId) {
            return res.status(400).json({
                message: "Job id required",
                success: false
            })
        };

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ 
            where: { job: jobId, applicant: userId } 
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // Check if the job exists
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(400).json({
                message: "Job not found",
                success: false
            })
        }

        // Create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            status: 'pending' // ✅ Add default status
        });

        // ✅ FIXED: Handle JSON field properly
        console.log('Current applications:', job.applications);
        
        let currentApplications = job.applications || [];
        
        // Ensure it's an array
        if (!Array.isArray(currentApplications)) {
            currentApplications = [];
        }
        
        // Add the new application ID if not already present
        if (!currentApplications.includes(newApplication.id)) {
            currentApplications.push(newApplication.id);
        }
        
        // Update the job with new applications array
        await job.update({
            applications: currentApplications
        });

        console.log('✅ Application created and job updated');
        
        return res.status(200).json({
            message: "Job applied successfully",
            success: true
        })
    } catch (error) {
        console.log('❌ Apply job error:', error.message);
        console.log('Full error:', error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.findAll({
            where: { applicant: userId },
            order: [['createdAt', 'DESC']], // ✅ Changed to DESC for newest first
            include: [
                {
                    model: Job,
                    as: "jobInfo",
                    include: [{
                        model: Company,
                        as: "companyInfo",
                    }]
                }
            ]
        });

        if (!application || application.length === 0) {
            return res.status(404).json({
                message: "No applications found",
                success: false
            })
        }

        return res.status(200).json({
            application,
            success: true
        })

    } catch (error) {
        console.log('❌ getAppliedJobs error:', error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

export const getApplicant = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        console.log('Getting applicants for job:', jobId);
        
        const job = await Job.findByPk(jobId, {
            include: [
                {
                    model: Application,
                    as: "jobApplications",
                    include: [{
                        model: User,
                        as: "applicantInfo",
                        attributes: ['id', 'fullname', 'email', 'phoneNumber'] // ✅ Select specific fields
                    }]
                }
            ]
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }

        console.log('✅ Found job with applicants:', job.jobApplications?.length || 0);

        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log('getApplicant error:', error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        
        console.log('🔄 Updating application status:', applicationId, 'to:', status);
        
        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false
            })
        }

        // Find the application by ID
        const application = await Application.findByPk(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            })
        }

        // Update the status 
        await application.update({
            status: status.toLowerCase()
        });

        console.log('Status updated successfully');

        return res.status(200).json({
            message: "Status updated successfully",
            success: true
        })
    } catch (error) {
        console.log('updateStatus error:', error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}