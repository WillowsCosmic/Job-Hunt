// models/associations.js
import Job from './job.js';
import Company from './company.js';

// Define the relationships using your existing 'company' column
Company.hasMany(Job, { 
    foreignKey: 'company', // Keep using existing column
    as: 'jobs' 
});

Job.belongsTo(Company, { 
    foreignKey: 'company', // Keep using existing column  
    as: 'companyInfo' // ✅ Different name to avoid conflict
});

export { Job, Company };
