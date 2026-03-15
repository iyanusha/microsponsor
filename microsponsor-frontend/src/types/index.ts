export interface Student {
  address: string;
  name: string;
  institution: string;
  program: string;
  academicYear: number;
  status: string;
  verified: boolean;
  totalReceived: number;
  milestonesCompleted: number;
}

export interface StudentMetrics {
  gpa: number;
  attendanceRate: number;
  completedCourses: number;
  totalCredits: number;
  lastUpdated: number;
}

export interface Institution {
  name: string;
  website: string;
  contactEmail: string;
  accreditationStatus: string;
  status: string;
  studentCount: number;
  totalScholarships: number;
  performanceRating: number;
}

export interface Scholarship {
  id: number;
  student: string;
  donor: string;
  amount: number;
  releasedAmount: number;
  milestoneCount: number;
  completedMilestones: number;
  category: string;
  status: string;
}

export interface Milestone {
  id: number;
  description: string;
  amount: number;
  completed: boolean;
  verified: boolean;
}

export interface DonorProfile {
  totalDonated: number;
  activeScholarships: number;
  completedScholarships: number;
  lastActivity: number;
}
