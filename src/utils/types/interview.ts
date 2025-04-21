export interface Interview {
    id: number;
    user_id: string;
    candidate_name: string;
    job_id: number;
    interview_date: string; // ISO date
    interview_time: string; // e.g. '14:30'
    mode: 'online' | 'onsite';
    status: 'scheduled' | 'done';
    created_at?: Date;
  }
  