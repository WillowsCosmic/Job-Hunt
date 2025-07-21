import Company from "../models/company.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name required",
                success: false
            })
        }
        
        let company = await Company.findOne({ where: { name: companyName } });
        
        if (company) {
            
            return res.status(400).json({
                message: "You cant register same company",
                success: false
            })
        }
        company = await Company.create({
            name: companyName,
            userId: req.id
        });
        return res.status(201).json({
            message: "Company registered successfully",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; //logged in userId
        const companies = await Company.findAll({ where: { userId } });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

//get company by id

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findByPk(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            })
        }
        return res.status(201).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

//update

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;
        //cloudinary implemented here


        const updateData = { name, description, website, location }

        const [updatedRowsCount] = await Company.update(updateData, {
            where: { id: req.params.id }
        });

        if (updatedRowsCount === 0) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        return res.status(201).json({
            message:"Company information updated",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}