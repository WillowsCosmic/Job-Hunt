// models/associations.js
import Job from './job.js';
import Company from './company.js';
import Application from './application.js';
import User from './user.js';

Company.hasMany(Job, { 
    foreignKey: 'company', 
    as: 'jobs' 
});

Job.belongsTo(Company, { 
    foreignKey: 'company', 
    as: 'companyInfo' 
});

Job.hasMany(Application, {
    foreignKey: 'job',
    as: 'jobApplications'  
});

Application.belongsTo(Job, { 
    foreignKey: 'job', 
    as: 'jobInfo' 
});

User.hasMany(Application, {
    foreignKey: 'applicant',
    as: 'userApplications'  
});

Application.belongsTo(User, { 
    foreignKey: 'applicant',
    as: 'applicantInfo' 
});

export { Job, Company, Application, User };