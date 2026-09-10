import { Issue, CommunityCluster, ActivityItem, PanchayatMetric } from '../types';

export const INITIAL_ISSUES: Issue[] = [
  {
    id: '#GS-1248',
    token: '#1248',
    title: 'Village Handpump Not Working',
    summary: '17 citizens reported contaminated muddy water and broken pump handle. Primary drinking source for 31 households in Harijan Basti. Urgent bore-well inspection required.',
    category: 'Water Supply & Sanitation',
    locationName: 'Ward 3 • Rampur Gram Panchayat',
    panchayat: 'Rampur Panchayat',
    coordinates: [23.2045, 77.0812],
    status: 'OPEN',
    priority: 'URGENT',
    reportedBy: 'Ramesh Kumar',
    reporterToken: '#CIT-SEH-402',
    createdAt: '2026-06-18T08:30:00Z',
    timeAgo: '2 hrs ago',
    assignedOfficer: {
      name: 'Ramesh Sharma',
      role: 'Block Administrator',
      department: 'Rural Dev & Panchayati Raj',
      unit: 'SDO Jal Nigam Sehore',
      phone: '+91 94251 00214',
      badge: '#MP-SEH-0402'
    },
    administrativeLevel: 'Block',
    currentAuthority: 'Block Administrator: Ramesh Sharma',
    slaRemainingHours: 24,
    slaBreached: false,
    upvotes: 31,
    photos: [
      'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80'
    ],
    voiceReport: {
      transcriptHindi: 'हमारे गांव का हैंडपंप तीन दिन से खराब है, पीने के पानी की भारी समस्या हो रही है। पानी में मैला आ रहा है।',
      transcriptEnglish: 'Our village handpump has been broken for 3 days, causing serious drinking water scarcity. Muddy water is coming out.',
      dialect: 'Bundeli / Malwi Voice Engine',
      duration: '00:08',
      audioUrl: ''
    },
    clusterId: 'cluster-handpump-1',
    clusterMembersCount: 17
  },
  {
    id: '#GS-1245',
    token: '#1245',
    title: 'Large Pothole on Main Road',
    summary: 'A deep 2-foot pothole has opened up near Sector 15 Central Park gate. It poses a severe hazard to two-wheelers and causes traffic bottlenecks during peak morning and evening hours.',
    category: 'Roads & Surface Transit',
    locationName: 'Sector 15 Central Road • Sehore Town',
    panchayat: 'Rampur Panchayat',
    coordinates: [23.2018, 77.0895],
    status: 'IN PROGRESS',
    priority: 'HIGH',
    reportedBy: 'Sunil Kumar',
    reporterToken: '#CIT-SEH-8841',
    createdAt: '2026-06-21T09:15:00Z',
    timeAgo: '4 hrs ago',
    assignedOfficer: {
      name: 'D. K. Sharma',
      role: 'Lead Field Engineer',
      department: 'PWD Roads & Highways',
      unit: 'FMC Road Works Team B (Unit #08)',
      phone: '+91 98260 44120',
      badge: '#MP-PWD-771'
    },
    administrativeLevel: 'Gram Panchayat',
    currentAuthority: 'Panchayat Road Cell: FMC Team B',
    slaRemainingHours: 14,
    slaBreached: false,
    upvotes: 32,
    photos: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    ],
    voiceReport: {
      transcriptHindi: 'रास्ते पे बहुत बड़ा गड्ढा हो गया है, कल रात को दो स्कूटर गिर गए थे। जल्दी ठीक करवाइये।',
      transcriptEnglish: 'A huge pothole has developed on the road, two scooters slipped last night. Please get it repaired urgently.',
      dialect: 'Hindi Regional Engine',
      duration: '00:12',
      audioUrl: ''
    },
    clusterMembersCount: 6
  },
  {
    id: '#GS-1250',
    token: '#1250',
    title: 'Distribution Transformer Oil Leak & Sparks',
    summary: 'Heavy sparks observed post 14:00 hrs. Low voltage surge impacting agricultural pumps across 14 neighboring farmlands. High risk of field fire.',
    category: 'Electricity & Power Grid',
    locationName: 'Shyampur Feeder • Pole #81',
    panchayat: 'Shyampur Panchayat',
    coordinates: [23.2125, 77.0988],
    status: 'OPEN',
    priority: 'URGENT',
    reportedBy: 'Rajesh Verma',
    reporterToken: '#CIT-SHY-109',
    createdAt: '2026-06-22T06:00:00Z',
    timeAgo: '6 hrs ago',
    assignedOfficer: {
      name: 'Rajesh Verma',
      role: 'Junior Engineer (JE)',
      department: 'MPPKVVCL Power Grid',
      unit: 'Substation Flying Squad',
      phone: '+91 94250 88712',
      badge: '#JE-PWR-990'
    },
    administrativeLevel: 'Gram Panchayat',
    currentAuthority: 'MPPKVVCL Shyampur Feeder JE',
    slaRemainingHours: 18,
    slaBreached: false,
    upvotes: 14,
    photos: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80'
    ],
    voiceReport: {
      transcriptHindi: 'ट्रांसफार्मर से तेल टपक रहा है और बहुत चिंगारी निकल रही है। मोटरें नहीं चल पा रही हैं।',
      transcriptEnglish: 'Oil is leaking from the transformer and heavy sparks are flying. Farm motors cannot run.',
      dialect: 'Malwi Dialect Engine',
      duration: '00:09'
    }
  },
  {
    id: '#GS-1244',
    token: '#1244',
    title: 'Burnt Distribution Transformer / Damaged Drainage',
    summary: 'Replacement unit 63kVA commissioned and verified. Drainage culvert desilted and concrete slab replaced.',
    category: 'Electricity & Power Grid',
    locationName: 'Mathura Road Market • Bilkisganj Feeder #4',
    panchayat: 'Bilkisganj Panchayat',
    coordinates: [23.195, 77.072],
    status: 'RESOLVED',
    priority: 'HIGH',
    reportedBy: 'Anita Chauhan',
    reporterToken: '#CIT-BIL-554',
    createdAt: '2026-06-10T11:00:00Z',
    timeAgo: 'June 10, 2026',
    assignedOfficer: {
      name: 'MPPKVVCL Junior Eng',
      role: 'Junior Engineer',
      department: 'Electricity Board',
      unit: 'Bilkisganj Maintenance',
      phone: '+91 98263 11200',
      badge: '#MP-WRK-092'
    },
    administrativeLevel: 'Gram Panchayat',
    currentAuthority: 'Panchayat VDO',
    slaRemainingHours: 0,
    slaBreached: false,
    upvotes: 19,
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
    ],
    resolutionDetails: {
      resolvedAt: 'June 12, 2026',
      resolvedBy: 'MPPKVVCL Junior Eng',
      notes: 'Replacement unit 63kVA commissioned & verified on site.',
      verificationPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      verifiedByWardOverseer: true
    }
  },
  {
    id: '#GS-1239',
    token: '#1239',
    title: 'Damaged Irrigation Canal Sluice / Broken Streetlight',
    summary: 'Work Order Issued to M/s Bundelkhand Earthworks. Broken streetlight replaced with 45W energy-saving LED module.',
    category: 'Irrigation Infrastructure',
    locationName: 'Rehti Minor Canal Ch. 12+400 • Shyampur',
    panchayat: 'Shyampur Panchayat',
    coordinates: [23.218, 77.105],
    status: 'RESOLVED',
    priority: 'MEDIUM',
    reportedBy: 'Devendra Patel',
    reporterToken: '#CIT-SHY-301',
    createdAt: '2026-06-05T14:30:00Z',
    timeAgo: 'June 05, 2026',
    assignedOfficer: {
      name: 'SDO Irrigation',
      role: 'Site Inspector',
      department: 'Water Resources Dept',
      unit: 'Sehore Canal Division',
      phone: '+91 94255 33211',
      badge: '#MP-IRR-108'
    },
    administrativeLevel: 'Gram Panchayat',
    currentAuthority: 'Gram Panchayat: Shyampur Kalan',
    slaRemainingHours: 0,
    slaBreached: false,
    upvotes: 22,
    photos: [
      'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80'
    ],
    resolutionDetails: {
      resolvedAt: 'June 08, 2026',
      resolvedBy: 'SDO Irrigation',
      notes: 'Sluice gate sealed and reinforced. Tested with live canal feed.',
      verifiedByWardOverseer: true
    }
  },
  {
    id: '#GS-1187',
    token: '#1187',
    title: 'Substation Transformer Failure',
    summary: 'Escalation Protocol Triggered: Issue escalated from Block to District Level due to SLA deadline expiration.',
    category: 'Electricity & Power Grid',
    locationName: 'Bilkisganj Substation',
    panchayat: 'Bilkisganj Panchayat',
    coordinates: [23.190, 77.068],
    status: 'IN PROGRESS',
    priority: 'URGENT',
    reportedBy: 'Kailash Chand',
    reporterToken: '#CIT-BIL-902',
    createdAt: '2026-06-15T07:00:00Z',
    timeAgo: 'Yesterday',
    assignedOfficer: {
      name: 'District Collector Memo #DC-814',
      role: 'District Authority Redressal Cell',
      department: 'District Redressal Oversight',
      unit: 'Flying Engineering Cell',
      phone: '+91 7562 224411',
      badge: '#DIST-SEH-01'
    },
    administrativeLevel: 'District',
    currentAuthority: 'District Magistrate Redressal Cell',
    slaRemainingHours: 0,
    slaBreached: true,
    slaBreachedTime: 'Breached by 22m',
    upvotes: 45,
    photos: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80'
    ],
    voiceReport: {
      transcriptHindi: 'सबस्टेशन का ट्रांसफार्मर पूरी तरह बैठ गया है। पिछले 36 घंटे से बिजली गुल है।',
      transcriptEnglish: 'The substation transformer has completely collapsed. No electricity for the last 36 hours.',
      dialect: 'Bundeli Dialect Engine',
      duration: '00:15'
    }
  },
  {
    id: '#GS-1251',
    token: '#1251',
    title: 'Clogged Drainage Canal & Overflow',
    summary: 'Automated Voice IVR logged via Citizen Phone Redressal line 1800-PANCHAYAT. Geotag assigned by nearby cell tower triangulation.',
    category: 'Sanitation & Drainage',
    locationName: 'Gram Mandi Gate #2',
    panchayat: 'Rampur Panchayat',
    coordinates: [23.208, 77.078],
    status: 'OPEN',
    priority: 'HIGH',
    reportedBy: 'Citizen via Voice IVR',
    reporterToken: '#IVR-7719',
    createdAt: '2026-06-21T18:24:00Z',
    timeAgo: 'Yesterday 18:24',
    administrativeLevel: 'Gram Panchayat',
    currentAuthority: 'Sanitation Inspector Doraha',
    slaRemainingHours: 32,
    slaBreached: false,
    upvotes: 8,
    photos: []
  }
];

export const INITIAL_CLUSTERS: CommunityCluster[] = [
  {
    id: 'cluster-handpump-1',
    title: 'Village Handpump Not Working',
    category: 'Water Supply & Sanitation',
    locationName: 'Ward 3, Rampur Gram Panchayat',
    panchayat: 'Rampur Panchayat',
    coordinates: [23.2045, 77.0812],
    reportsCount: 17,
    citizensAffected: 31,
    photosCount: 12,
    voiceReportsCount: 5,
    similarityScore: 94,
    dialectEngine: 'Bundeli / Hindi Voice Engine',
    status: 'OPEN',
    primaryIssueId: '#GS-1248',
    sampleReports: [
      {
        citizen: 'Citizen A (Ramesh K.)',
        text: 'Handpump kharab hai, paani nahi aa raha 3 din se',
        time: '2h ago',
        type: 'voice'
      },
      {
        citizen: 'Citizen B (Suman Devi)',
        text: 'Village handpump not working, rod broken',
        time: '3h ago',
        type: 'text'
      },
      {
        citizen: 'Citizen C (Harish P.)',
        text: 'Paani wala pump band hai, kripya theek karein',
        time: '4h ago',
        type: 'voice'
      },
      {
        citizen: 'Citizen D (Laxman)',
        text: 'Attached ground inspection photograph of broken base',
        time: '5h ago',
        type: 'photo'
      }
    ]
  },
  {
    id: 'cluster-pothole-2',
    title: 'Sector 15 Deep Pothole Cluster',
    category: 'Roads & Surface Transit',
    locationName: 'Sector 15 Central Road',
    panchayat: 'Rampur Panchayat',
    coordinates: [23.2018, 77.0895],
    reportsCount: 6,
    citizensAffected: 32,
    photosCount: 8,
    voiceReportsCount: 3,
    similarityScore: 91,
    dialectEngine: 'Hindi Regional Engine',
    status: 'IN PROGRESS',
    primaryIssueId: '#GS-1245',
    sampleReports: [
      {
        citizen: 'Sunil Kumar',
        text: 'Raaste pe bohot bada gaddha ho gaya hai',
        time: '4h ago',
        type: 'voice'
      },
      {
        citizen: 'Vikram Joshi',
        text: 'Dangerous pothole near park gate, two-wheelers slipping',
        time: '6h ago',
        type: 'text'
      }
    ]
  }
];

export const INITIAL_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-1',
    location: 'Sector 15 Market',
    type: 'RESOLVED',
    issueId: '#1248',
    issueTitle: 'Broken Streetlight',
    description: 'Municipal Maintenance Team marked Issue #1248 (Broken Streetlight) as RESOLVED. Verification notes: "Replacement bulb installed and tested."',
    timeAgo: '10 MINS AGO',
    officerId: '#MP-WRK-092',
    hasPhotoProof: true
  },
  {
    id: 'act-2',
    location: 'Sector 15 Main Road',
    type: 'UPDATE',
    issueId: '#1245',
    issueTitle: 'Large Pothole',
    description: 'Status updated on Issue #1245 (Large Pothole). Changed from [Open] to [IN PROGRESS]. Assigned to: FMC Road Works Team B.',
    timeAgo: '2 HRS AGO',
    estimatedResolution: '6 hrs'
  },
  {
    id: 'act-3',
    location: 'Rampur Panchayat',
    type: 'CONSOLIDATED',
    issueId: '#1248',
    issueTitle: 'Handpump Maintenance',
    description: 'Community Consolidation Triggered: 17 citizen voice logs merged into Issue #1248 (Handpump Maintenance). Confidence: 94%.',
    timeAgo: '4 HRS AGO',
    dialectEngine: 'Bundeli/Hindi Voice Engine',
    hasAudioSample: true
  },
  {
    id: 'act-4',
    location: 'Bilkisganj Substation',
    type: 'ESCALATED',
    issueId: '#1187',
    issueTitle: 'Transformer failure',
    description: 'Escalation Protocol Triggered: Issue #1187 (Transformer failure) escalated from Block to District Level due to SLA deadline.',
    timeAgo: 'YESTERDAY',
    notes: 'SLA Default: 48h breached by 22m',
    memoRef: 'District Collector Memo #DC-814'
  },
  {
    id: 'act-5',
    location: 'Gram Mandi Gate #2',
    type: 'NEW_REPORT',
    issueId: '#1251',
    issueTitle: 'Clogged Drainage Canal',
    description: 'Automated Voice IVR logged Issue #1251 (Clogged Drainage Canal) via Citizen Phone Redressal line. Geotag assigned by nearby cell tower triangulation.',
    timeAgo: 'YESTERDAY 18:24',
    channel: 'Toll-Free 1800-PANCHAYAT'
  }
];

export const PANCHAYAT_METRICS: PanchayatMetric[] = [
  {
    name: 'Rampur Panchayat',
    officer: 'Devendra Patel',
    role: 'SDO',
    openIssues: 5,
    attendanceRate: 94,
    status: 'urgent'
  },
  {
    name: 'Bilkisganj Panchayat',
    officer: 'Anita Chauhan',
    role: 'VDO',
    openIssues: 1,
    attendanceRate: 100,
    status: 'normal'
  },
  {
    name: 'Shyampur Panchayat',
    officer: 'Rajesh Verma',
    role: 'JE',
    openIssues: 4,
    attendanceRate: 88,
    status: 'urgent'
  },
  {
    name: 'Doraha Panchayat',
    officer: 'Mohan Lal',
    role: 'Panchayat Secy',
    openIssues: 2,
    attendanceRate: 96,
    status: 'normal'
  }
];
