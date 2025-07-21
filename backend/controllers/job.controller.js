import { Op } from "sequelize";
// import Job from "../models/job.js";
// import Company from "../models/company.js";
import { Job, Company } from "../models/associations.js";

export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        })
        return res.status(201).json({
            message: "New job created sucessfully",
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || ""

        //query creates a search instruction object

        //%${keyword}% = find keyword anywhere in the text
        // % = wildcard (matches any characters)
        // So %developer% finds: "Senior Developer", "Web Developer Job", "developer position"

        const query = {
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${keyword}%` } },
                    { description: { [Op.like]: `%${keyword}%` } }
                ]
            },
            include: [
                {
                    model: Company,
                    as: 'companyInfo',
                    attributes: ['id', 'name', 'logo', 'location']
                }
            ],
            order: [['createdAt', 'DESC']]

        };
        const jobs = await Job.findAll(query)
        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
}
export const getJobById = async (req,res) =>{
    try {
        const jobId = req.params.id;
        const job = await Job.findByPk(jobId);
        if(!job){
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        
    }
}

export const getAdminJobs = async (req,res) =>{
    try {
        const adminId = req.id;
        const jobs = await Job.findAll({where:{created_by:adminId}})
        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}