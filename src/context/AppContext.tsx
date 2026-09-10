import React, { createContext, useContext, useState, useEffect } from 'react';
import { Issue, CommunityCluster, ActivityItem, IssueStatus, AdministrativeTier } from '../types';
import { INITIAL_ISSUES, INITIAL_CLUSTERS, INITIAL_ACTIVITY } from '../data/mockData';

interface AppContextType {
  role: 'citizen' | 'official' | null;
  setRole: (role: 'citizen' | 'official' | null) => void;
  language: 'hi' | 'en' | 'malwi';
  setLanguage: (lang: 'hi' | 'en' | 'malwi') => void;
  citizenTab: 'home' | 'report' | 'map' | 'activity' | 'profile';
  setCitizenTab: (tab: 'home' | 'report' | 'map' | 'activity' | 'profile') => void;
  officialTab: 'dashboard' | 'issues' | 'community' | 'map' | 'escalations' | 'analytics' | 'activity' | 'profile';
  setOfficialTab: (tab: 'dashboard' | 'issues' | 'community' | 'map' | 'escalations' | 'analytics' | 'activity' | 'profile') => void;
  issues: Issue[];
  clusters: CommunityCluster[];
  activities: ActivityItem[];
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;
  selectedClusterId: string | null;
  setSelectedClusterId: (id: string | null) => void;
  notifications: Array<{ id: string; title: string; time: string; read: boolean; type: string }>;
  markNotificationRead: (id: string) => void;
  login: (role: 'citizen' | 'official') => void;
  logout: () => void;
  submitNewIssue: (issueData: Partial<Issue>) => { issue: Issue; matchedCluster?: CommunityCluster };
  joinCluster: (clusterId: string, citizenReportText: string) => void;
  updateIssueStatus: (id: string, status: IssueStatus, notes?: string) => void;
  escalateIssue: (id: string, reason?: string) => void;
  upvoteIssue: (id: string) => void;
  reassignIssue: (id: string, officer: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<'citizen' | 'official' | null>(() => {
    const saved = localStorage.getItem('gramsetu_role');
    return (saved as any) || null;
  });

  const [language, setLanguage] = useState<'hi' | 'en' | 'malwi'>(() => {
    return (localStorage.getItem('gramsetu_lang') as any) || 'hi';
  });

  const [citizenTab, setCitizenTab] = useState<'home' | 'report' | 'map' | 'activity' | 'profile'>('home');
  const [officialTab, setOfficialTab] = useState<'dashboard' | 'issues' | 'community' | 'map' | 'escalations' | 'analytics' | 'activity' | 'profile'>('dashboard');

  const [issues, setIssues] = useState<Issue[]>(() => {
    const saved = localStorage.getItem('gramsetu_issues');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [clusters, setClusters] = useState<CommunityCluster[]>(() => {
    const saved = localStorage.getItem('gramsetu_clusters');
    return saved ? JSON.parse(saved) : INITIAL_CLUSTERS;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('gramsetu_activity');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY;
  });

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);

  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Issue #GS-1248 escalated to Block Level oversight', time: '10m ago', read: false, type: 'alert' },
    { id: 'n2', title: '17 citizen voice logs amalgamated for Ward 3 Handpump', time: '1h ago', read: false, type: 'cluster' },
    { id: 'n3', title: 'Work Order #8821 dispatched to FMC Road Works', time: '2h ago', read: true, type: 'work' },
    { id: 'n4', title: 'Monsoon Alert: High water logging expected in Sector 15', time: '5h ago', read: true, type: 'weather' }
  ]);

  useEffect(() => {
    localStorage.setItem('gramsetu_role', role || '');
  }, [role]);

  useEffect(() => {
    localStorage.setItem('gramsetu_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('gramsetu_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('gramsetu_clusters', JSON.stringify(clusters));
  }, [clusters]);

  useEffect(() => {
    localStorage.setItem('gramsetu_activity', JSON.stringify(activities));
  }, [activities]);

  const login = (newRole: 'citizen' | 'official') => {
    setRole(newRole);
    if (newRole === 'citizen') {
      setCitizenTab('home');
    } else {
      setOfficialTab('dashboard');
    }
  };

  const logout = () => {
    setRole(null);
    setSelectedIssueId(null);
    setSelectedClusterId(null);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const submitNewIssue = (issueData: Partial<Issue>) => {
    const nextTokenNum = 1250 + Math.floor(Math.random() * 50);
    const newId = `#GS-${nextTokenNum}`;
    const token = `#${nextTokenNum}`;

    const newIssue: Issue = {
      id: newId,
      token: token,
      title: issueData.title || 'Reported Civic Issue',
      summary: issueData.summary || 'Civic infrastructure defect logged by citizen.',
      category: issueData.category || 'Water Supply & Sanitation',
      locationName: issueData.locationName || 'Ward 3 • Rampur Gram Panchayat',
      panchayat: issueData.panchayat || 'Rampur Panchayat',
      coordinates: issueData.coordinates || [23.2045, 77.0812],
      status: 'OPEN',
      priority: issueData.priority || 'HIGH',
      reportedBy: issueData.reportedBy || 'Ramesh Kumar',
      reporterToken: issueData.reporterToken || '#CIT-SEH-402',
      createdAt: new Date().toISOString(),
      timeAgo: 'Just now',
      administrativeLevel: 'Gram Panchayat',
      currentAuthority: 'Panchayat Grievance Cell',
      slaRemainingHours: 48,
      slaBreached: false,
      upvotes: 1,
      photos: issueData.photos || [],
      voiceReport: issueData.voiceReport
    };

    // Check for community similarity (e.g. if handpump or water in text)
    const textToCheck = `${newIssue.title} ${newIssue.summary} ${newIssue.voiceReport?.transcriptHindi || ''} ${newIssue.voiceReport?.transcriptEnglish || ''}`.toLowerCase();
    
    let matchedCluster: CommunityCluster | undefined;
    if (textToCheck.includes('handpump') || textToCheck.includes('pump') || textToCheck.includes('हैंडपंप') || textToCheck.includes('paani') || textToCheck.includes('पानी')) {
      matchedCluster = clusters.find(c => c.id === 'cluster-handpump-1');
    } else if (textToCheck.includes('pothole') || textToCheck.includes('road') || textToCheck.includes('गड्ढा') || textToCheck.includes('सड़क')) {
      matchedCluster = clusters.find(c => c.id === 'cluster-pothole-2');
    }

    setIssues(prev => [newIssue, ...prev]);

    // Add to activity stream
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      location: newIssue.locationName,
      type: 'NEW_REPORT',
      issueId: newIssue.token,
      issueTitle: newIssue.title,
      description: `New grievance logged by ${newIssue.reportedBy}. Geotagged and assigned to ${newIssue.panchayat}.`,
      timeAgo: 'JUST NOW',
      channel: newIssue.voiceReport ? 'Citizen Voice Assistant' : 'Citizen Web Portal',
      hasPhotoProof: newIssue.photos.length > 0
    };
    setActivities(prev => [newActivity, ...prev]);

    return { issue: newIssue, matchedCluster };
  };

  const joinCluster = (clusterId: string, citizenReportText: string) => {
    setClusters(prev => prev.map(cl => {
      if (cl.id === clusterId) {
        return {
          ...cl,
          reportsCount: cl.reportsCount + 1,
          citizensAffected: cl.citizensAffected + 2,
          sampleReports: [
            {
              citizen: 'Ramesh Kumar (You)',
              text: citizenReportText || 'Endorsed this community issue from Ward 3',
              time: 'Just now',
              type: 'voice'
            },
            ...cl.sampleReports
          ]
        };
      }
      return cl;
    }));

    // Update the linked issue's upvotes
    const cluster = clusters.find(c => c.id === clusterId);
    if (cluster) {
      setIssues(prev => prev.map(iss => {
        if (iss.id === cluster.primaryIssueId) {
          return {
            ...iss,
            upvotes: iss.upvotes + 1,
            clusterMembersCount: (iss.clusterMembersCount || cluster.reportsCount) + 1
          };
        }
        return iss;
      }));

      // Log amalgamation
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        location: cluster.locationName,
        type: 'CONSOLIDATED',
        issueId: cluster.primaryIssueId,
        issueTitle: cluster.title,
        description: `Citizen endorsed community petition. Total petitions merged: ${cluster.reportsCount + 1}.`,
        timeAgo: 'JUST NOW',
        dialectEngine: cluster.dialectEngine
      };
      setActivities(prev => [newAct, ...prev]);
    }
  };

  const updateIssueStatus = (id: string, status: IssueStatus, notes?: string) => {
    setIssues(prev => prev.map(iss => {
      if (iss.id === id || iss.token === id) {
        const isResolved = status === 'RESOLVED' || status === 'CLOSED';
        return {
          ...iss,
          status,
          resolutionDetails: isResolved ? {
            resolvedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            resolvedBy: 'Ramesh Sharma (Block Administrator)',
            notes: notes || 'Work completed on site, verified with photographic evidence.',
            verifiedByWardOverseer: true
          } : iss.resolutionDetails
        };
      }
      return iss;
    }));

    const targetIssue = issues.find(i => i.id === id || i.token === id);
    const actType = status === 'RESOLVED' ? 'RESOLVED' : 'UPDATE';
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      location: targetIssue?.locationName || 'Jurisdiction Site',
      type: actType,
      issueId: targetIssue?.token || id,
      issueTitle: targetIssue?.title || 'Civic Issue',
      description: `Official status update: Changed to [${status}]. ${notes ? `"${notes}"` : ''}`,
      timeAgo: 'JUST NOW',
      officerId: '#MP-SEH-0402'
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const escalateIssue = (id: string, reason?: string) => {
    const tierOrder: AdministrativeTier[] = ['Gram Panchayat', 'Block', 'District', 'State'];
    
    setIssues(prev => prev.map(iss => {
      if (iss.id === id || iss.token === id) {
        const currentIdx = tierOrder.indexOf(iss.administrativeLevel);
        const nextTier = currentIdx < tierOrder.length - 1 ? tierOrder[currentIdx + 1] : 'State';
        return {
          ...iss,
          administrativeLevel: nextTier,
          currentAuthority: `${nextTier} Authority Oversight Cell`,
          priority: 'URGENT',
          slaBreached: true,
          slaBreachedTime: 'Escalated by Admin Directive'
        };
      }
      return iss;
    }));

    const targetIssue = issues.find(i => i.id === id || i.token === id);
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      location: targetIssue?.locationName || 'Jurisdiction Area',
      type: 'ESCALATED',
      issueId: targetIssue?.token || id,
      issueTitle: targetIssue?.title || 'Escalated Matter',
      description: `Escalation Protocol Triggered: ${targetIssue?.title} escalated to next tier due to SLA urgency. ${reason ? `Memo: ${reason}` : ''}`,
      timeAgo: 'JUST NOW',
      memoRef: `Direct Memo #ESC-${Math.floor(100 + Math.random() * 900)}`
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const upvoteIssue = (id: string) => {
    setIssues(prev => prev.map(iss => iss.id === id || iss.token === id ? { ...iss, upvotes: iss.upvotes + 1 } : iss));
  };

  const reassignIssue = (id: string, officer: any) => {
    setIssues(prev => prev.map(iss => {
      if (iss.id === id || iss.token === id) {
        return {
          ...iss,
          assignedOfficer: officer,
          status: 'ASSIGNED'
        };
      }
      return iss;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        citizenTab,
        setCitizenTab,
        officialTab,
        setOfficialTab,
        issues,
        clusters,
        activities,
        selectedIssueId,
        setSelectedIssueId,
        selectedClusterId,
        setSelectedClusterId,
        notifications,
        markNotificationRead,
        login,
        logout,
        submitNewIssue,
        joinCluster,
        updateIssueStatus,
        escalateIssue,
        upvoteIssue,
        reassignIssue
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
