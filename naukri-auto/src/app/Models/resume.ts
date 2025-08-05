export interface Resume {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  pincode: string;
  phoneNumber: string;
  email: string;
  jobs: Jobs[];
  education: Education[];
  projects: Projects[];
  skills: string;
  certifications: string;
  achievements: string;
}

export interface Jobs {
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate: string;
    city: string;
    country: string;
    description: string;
    currentlyWorking: false;
}


export interface Education {
    schoolName: string;
    schoolLocation: string;
    fieldOfStudy: string;
    qualification: string;
    graduationYear: string;
    percentageOrCgpa: number;
    country?: string;
}

export interface Projects {
    projectName: string;
    projectDescription: string;
    technologiesUsed: string;
}
