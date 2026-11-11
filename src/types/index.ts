export interface AdminStats {
  total_registered_users: number;
  active_schemes_count: number;
  application_guides_count: number;
  scam_scans_performed: number;
  total_help_requests: number;
  pending_help_requests: number;
  verified_volunteers_count: number;
  category_distribution: { category: string; count: number }[];
  village_distribution: { village: string; user_count: number; active_requests: number }[];
  top_demanded_services: { name: string; usage: number }[];
  average_digital_confidence_score: number;
}

export interface Scheme {
  id: number;
  title: string;
  title_te: string;
  target_category: string;
  short_description: string;
  benefits: string;
  official_url: string;
  is_active: boolean;
  last_verified_date: string;
}

export interface ApplicationGuide {
  id: number;
  title: string;
  title_te: string;
  service_category: string;
  official_portal_url: string;
  steps_count: number;
  last_verified_date: string;
}

export interface JobOpportunity {
  id: number;
  title: string;
  organization: string;
  category: string;
  qualification: string;
  location: string;
  application_deadline: string;
  is_active: boolean;
}

export interface Volunteer {
  id: number;
  full_name: string;
  phone_masked: string;
  village: string;
  mandal: string;
  specialization: string;
  rating: number;
  completed_requests: number;
  is_available: boolean;
}

export interface HelpRequest {
  id: number;
  requester_name?: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  village: string;
  mandal: string;
  contact_phone_masked: string;
  assigned_volunteer_name?: string;
  created_at: string;
  resolved_at?: string;
  user_rating?: number;
}

export interface UserProfile {
  preferred_language: 'te' | 'en' | 'hi';
  category: 'farmer' | 'student' | 'homemaker' | 'senior_citizen' | 'general';
  district?: string;
  mandal?: string;
  village?: string;
  age_group?: string;
  occupation?: string;
  digital_confidence_score: number;
}

export interface User {
  id: number;
  phone: string;
  email?: string;
  full_name: string;
  role: 'admin' | 'user' | 'volunteer' | 'guest';
  is_active: boolean;
  profile?: UserProfile;
}

export interface UserRegisterPayload {
  phone: string;
  full_name: string;
  password: string;
  preferred_language: 'te' | 'en' | 'hi';
  category: string;
  district?: string;
  mandal?: string;
  village?: string;
}

export interface HelpRequestCreatePayload {
  title: string;
  description: string;
  category: string;
  village: string;
  mandal?: string;
  contact_phone: string;
}

