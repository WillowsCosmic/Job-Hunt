import { Job, Company, Application, User } from "../models/associations.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
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
        });

        
        return res.status(200).json({
            message: "Job applied successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
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
            order: [['createdAt', 'ASC']],
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

        if (!application || application.length === 0) {  // ✅ Better check
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
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

export const getApplicant = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        const job = await Job.findByPk(jobId, {  // ✅ Fixed syntax
            include: [
                {
                    model: Application,
                    as: "jobApplications",  // ✅ Match your associations
                    include: [{
                        model: User,
                        as: "applicantInfo",
                    }]
                }
            ]
        });

        if (!job) {
            return res.status(404).json({  // ✅ 404 for not found
                message: "Job not found",
                success: false
            })
        }

        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
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
        
        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false
            })
        }

        // Find the application by ID
        const application = await Application.findByPk(applicationId);  // ✅ Simpler
        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            })
        }

        // Update the status 
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}