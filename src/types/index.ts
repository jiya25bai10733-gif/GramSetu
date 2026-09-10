export type UserRole = 'citizen' | 'official';
export type Language = 'hi' | 'en' | 'malwi';

export type IssueStatus =
  | 'OPEN'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN PROGRESS'
  | 'REPAIR SCHEDULED'
  | 'RESOLVED'
  | 'CLOSED';

export type IssuePriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AdministrativeTier = 'Gram Panchayat' | 'Block' | 'District' | 'State';

export interface AssignedOfficer {
  name: string;
  role: string;
  department: string;
  unit: string;
  phone: string;
  badge: string;
}

export interface VoiceReportData {
  transcriptHindi: string;
  transcriptEnglish: string;
  dialect: string;
  duration: string;
  audioUrl?: string;
}

export interface Issue {
  id: string; // e.g. "#GS-1248" or "#1245"
  token: string;
  title: string;
  summary: string;
  category: string;
  locationName: string;
  panchayat: string;
  coordinates: [number, number];
  status: IssueStatus;
  priority: IssuePriority;
  reportedBy: string;
  reporterToken: string;
  createdAt: string;
  timeAgo: string;
  assignedOfficer?: AssignedOfficer;
  administrativeLevel: AdministrativeTier;
  currentAuthority: string;
  slaRemainingHours: number;
  slaBreached: boolean;
  slaBreachedTime?: string;
  upvotes: number;
  photos: string[];
  voiceReport?: VoiceReportData;
  clusterId?: string;
  clusterMembersCount?: number;
  resolutionDetails?: {
    resolvedAt: string;
    resolvedBy: string;
    notes: string;
    verificationPhoto?: string;
    verifiedByWardOverseer?: boolean;
  };
}

export interface CommunityCluster {
  id: string;
  title: string;
  category: string;
  locationName: string;
  panchayat: string;
  coordinates: [number, number];
  reportsCount: number;
  citizensAffected: number;
  photosCount: number;
  voiceReportsCount: number;
  similarityScore: number; // percentage e.g. 94
  dialectEngine: string; // e.g. "Bundeli/Hindi Voice Engine"
  status: IssueStatus;
  primaryIssueId: string;
  sampleReports: {
    citizen: string;
    text: string;
    time: string;
    type: 'voice' | 'text' | 'photo';
  }[];
}

export interface ActivityItem {
  id: string;
  location: string;
  type: 'RESOLVED' | 'UPDATE' | 'CONSOLIDATED' | 'ESCALATED' | 'NEW_REPORT';
  issueId: string;
  issueTitle: string;
  description: string;
  timeAgo: string;
  officerId?: string;
  notes?: string;
  dialectEngine?: string;
  memoRef?: string;
  channel?: string;
  hasAudioSample?: boolean;
  hasPhotoProof?: boolean;
  estimatedResolution?: string;
}

export interface PanchayatMetric {
  name: string;
  officer: string;
  role: string;
  openIssues: number;
  attendanceRate: number;
  status: 'normal' | 'urgent';
}
