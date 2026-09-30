import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Edit3, 
  Mail, 
  Building2, 
  MapPin, 
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface JurisdictionGrievance {
  id: string;
  token: string;
  title: string;
  letter: string;
  tag: string;
  tagClass: string;
  location: string;
  category: string;
  officerLabel: string;
  officer: string;
  reportedDate: string;
  actionText: string;
  actionClass: string;
  status: 'active' | 'resolved';
  footerLeftIcon?: 'clock' | 'check' | 'none';
  footerLeftText: string;
  footerLeftClass?: string;
  footerRightText: string;
}

const ALL_JURISDICTION_GRIEVANCES: JurisdictionGrievance[] = [
  // --- Active Grievances (14 items) ---
  {
    id: '#GS-1248',
    token: '#1248',
    title: 'VILLAGE HANDPUMP NOT WORKING',
    letter: 'W',
    tag: 'URGENT',
    tagClass: 'bg-red-100 text-red-800',
    location: 'Ward 3 • Rampur',
    category: 'Water Supply & Sanitation',
    officerLabel: 'Officer in Charge',
    officer: 'Ramesh Sharma',
    reportedDate: 'June 18, 2026',
    actionText: 'OPEN',
    actionClass: 'border border-[#0F2A4A] text-[#0F2A4A] hover:bg-blue-50',
    status: 'active',
    footerLeftIcon: 'clock',
    footerLeftText: 'Redressal SLA: 24h Remaining',
    footerLeftClass: 'flex items-center text-amber-700 font-bold',
    footerRightText: 'Last Inspection: Field Technician Dispatched (2 hrs ago)'
  },
  {
    id: '#GS-1245',
    token: '#1245',
    title: 'LARGE POTHOLE',
    letter: 'R',
    tag: 'ROADS CELL',
    tagClass: 'bg-amber-100 text-amber-800',
    location: 'Sector 15 Central Road • Sehore Town',
    category: 'Roads & Public Works',
    officerLabel: 'Field Contractor',
    officer: 'PWD Div 2',
    reportedDate: 'June 21, 2026',
    actionText: 'PENDING',
    actionClass: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    status: 'active',
    footerLeftIcon: 'none',
    footerLeftText: 'Material Allocation in Progress',
    footerLeftClass: '',
    footerRightText: 'Citizen Follow-ups: 6 Endorsements'
  },
  {
    id: '#GS-1250',
    token: '#1250',
    title: 'TRANSFORMER OIL LEAK & SPARKS',
    letter: 'P',
    tag: 'HIGH PRIORITY',
    tagClass: 'bg-red-100 text-red-800',
    location: 'Shyampur Feeder • Pole #81',
    category: 'Electricity & Power Grid',
    officerLabel: 'Officer in Charge',
    officer: 'Rajesh Verma',
    reportedDate: 'June 22, 2026',
    actionText: 'OPEN',
    actionClass: 'border border-[#0F2A4A] text-[#0F2A4A] hover:bg-blue-50',
    status: 'active',
    footerLeftIcon: 'clock',
    footerLeftText: 'Redressal SLA: 18h Remaining',
    footerLeftClass: 'flex items-center text-amber-700 font-bold',
    footerRightText: 'Dispatched: Substation Flying Squad Unit'
  },
  {
    id: '#GS-1187',
    token: '#1187',
    title: 'SUBSTATION TRANSFORMER OUTAGE',
    letter: 'D',
    tag: 'DISTRICT ESCALATION',
    tagClass: 'bg-purple-100 text-purple-900',
    location: 'Bilkisganj Substation Ground',
    category: 'Power Transmission & Distribution',
    officerLabel: 'Oversight Authority',
    officer: 'District Collector Memo #DC-814',
    reportedDate: 'June 20, 2026',
    actionText: 'IN PROGRESS',
    actionClass: 'bg-purple-700 text-white',
    status: 'active',
    footerLeftIcon: 'none',
    footerLeftText: 'SLA Exceeded by 22m • Direct District Magistrate Audit',
    footerLeftClass: 'text-red-600 font-bold',
    footerRightText: 'Multi-Panchayat Joint Grid Restoral'
  },
  {
    id: '#GS-1251',
    token: '#1251',
    title: 'CLOGGED DRAINAGE CANAL & OVERFLOW',
    letter: 'S',
    tag: 'SANITATION CELL',
    tagClass: 'bg-amber-100 text-amber-800',
    location: 'Gram Mandi Gate #2 • Rampur',
    category: 'Sanitation & Drainage',
    officerLabel: 'Field Supervisor',
    officer: 'VDO Rampur Panchayat',
    reportedDate: 'June 23, 2026',
    actionText: 'PENDING',
    actionClass: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    status: 'active',
    footerLeftIcon: 'clock',
    footerLeftText: 'Redressal SLA: 36h Remaining',
    footerLeftClass: 'flex items-center text-amber-700 font-bold',
    footerRightText: 'Citizen Voice IVR amalgamated: 8 reports'
  },
  {
    id: '#GS-1253',
    token: '#1253',
    title: 'PRIMARY HEALTH CENTER POWER BACKUP FAILURE',
    letter: 'H',
    tag: 'URGENT HEALTH',
    tagClass: 'bg-red-100 text-red-800',
    location: 'Bhaunra Health Sub-center • Ward 2',
    category: 'Public Health Infrastructure',
    officerLabel: 'Nodal Engineer',
    officer: 'Health Engineering Cell',
    reportedDate: 'June 24, 2026',
    actionText: 'OPEN',
    actionClass: 'border border-[#0F2A4A] text-[#0F2A4A] hover:bg-blue-50',
    status: 'active',
    footerLeftIcon: 'clock',
    footerLeftText: 'Redressal SLA: 6h Critical Window',
    footerLeftClass: 'flex items-center text-red-600 font-bold',
    footerRightText: 'Cold chain vaccines at risk • Emergency DG deployed'
  },
  {
    id: '#GS-1255',
    token: '#1255',
    title: 'ANGANWADI ROOF WATER SEEPAGE',
    letter: 'A',
    tag: 'WOMEN & CHILD',
    tagClass: 'bg-pink-100 text-pink-900',
    location: 'Ward 5 • Doraha Panchayat',
    category: 'Social Welfare & Childcare',
    officerLabel: 'Block Inspector',
    officer: 'Rural Engineering Service (RES)',
    reportedDate: 'June 24, 2026',
    actionText: 'IN PROGRESS',
    actionClass: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    status: 'active',
    footerLeftIcon: 'none',
    footerLeftText: 'Waterproofing estimate approved (₹45,000)',
    footerLeftClass: '',
    footerRightText: 'Gram Panchayat: Doraha'
  },
  {
    id: '#GS-1258',
    token: '#1258',
    title: 'BROKEN OVERHEAD TANK OUTFLOW PIPE',
    letter: 'W',
    tag: 'JAL JEEVAN',
    tagClass: 'bg-blue-100 text-[#0F2A4A]',
    location: 'Ghatla Village • Shyampur',
    category: 'Jal Jeevan Mission',
    officerLabel: 'SDO Water',
    officer: 'PHED Sehore Unit',
    reportedDate: 'June 25, 2026',
    actionText: 'OPEN',
    actionClass: 'border border-[#0F2A4A] text-[#0F2A4A] hover:bg-blue-50',
    status: 'active',
    footerLeftIcon: 'clock',
    footerLeftText: 'Redressal SLA: 18h Remaining',
    footerLeftClass: 'flex items-center text-amber-700 font-bold',
    footerRightText: 'Water supply diverted to reserve bore'
  },
  {
    id: '#GS-1262',
    token: '#1262',
    title: 'COLLAPSED BOX CULVERT ON FARM CONNECTIVITY ROAD',
    letter: 'C',
    tag: 'PMGSY CELL',
    tagClass: 'bg-amber-100 text-amber-900',
    location: 'Kalyanpur Link Road • Bilkisganj',
    category: 'Rural Connectivity',
    officerLabel: 'Project Director',
    officer: 'PMGSY Project Unit 1',
    reportedDate: 'June 26, 2026',
    actionText: 'PENDING',
    actionClass: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    status: 'active',
    footerLeftIcon: 'none',
    footerLeftText: 'Temporary bypass passage cleared for tractors',
    footerLeftClass: '',
    footerRightText: 'Tender sanction under review'
  },
  {
    id: '#GS-1264',
    token: '#1264',
    title: 'UNPAVED KACHHA ROAD WATERLOGGING',
    letter: 'R',
    tag: 'ROAD WORK',
    tagClass: 'bg-amber-100 text-amber-800',
    location: 'Ward 2 • Sehore Rural',
    category: 'Panchayat Infrastructure',
    officerLabel: 'Secretary',
    officer: 'Panchayat Sachiv',
    reportedDate: 'June 27, 2026',
    actionText: 'IN PROGRESS',
    actionClass: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    status: 'active',
    footerLeftIcon: 'none',
    footerLeftText: 'Gravel layering started via MNREGA',
    footerLeftClass: '',
    footerRightText: '12 daily wage laborers deployed'
  },
  {
    id: '#GS-1267',
    token: '#1267',
    title: 'SOLAR HIGH-MAST LIGHT NON-FUNCTIONAL',
    letter: 'L',
    tag: 'RENEWABLE',
    tagClass: 'bg-emerald-100 text-emerald-900',
    location: 'Main Chowk • Ichhawar Block',
    category: 'Renewable Energy',
    officerLabel: 'Maintenance Team',
    officer: 'MPUVNL Technical Cell',
    reportedDate: 'June 27, 2026',
    actionText: 'OPEN',
    actionClass: 'border border-[#0F2A4A] text-[#0F2A4A] hover:bg-blue-50',
    status: 'active',
    footerLeftIcon: 'clock',
    footerLeftText: 'Redressal SLA: 48h Remaining',
    footerLeftClass: 'flex items-center text-slate-700 font-medium',
    footerRightText: 'Inverter battery inspection scheduled'
  },
  {
    id: '#GS-1270',
    token: '#1270',
    title: 'DRINKING WATER PIPELINE CONTAMINATION',
    letter: 'W',
    tag: 'URGENT WATER',
    tagClass: 'bg-red-100 text-red-800',
    location: 'Harijan Basti • Rampur',
    category: 'Public Health Engineering',
    officerLabel: 'Chief Medical Officer',
    officer: 'PHED Water Testing Lab',
    reportedDate: 'June 28, 2026',
    actionText: 'OPEN',
    actionClass: 'border border-[#0F2A4A] text-[#0F2A4A] hover:bg-blue-50',
    status: 'active',
    footerLeftIcon: 'clock',
    footerLeftText: 'Redressal SLA: 12h Critical Window',
    footerLeftClass: 'flex items-center text-red-600 font-bold',
    footerRightText: 'Water tanker dispatched as temporary relief'
  },
  {
    id: '#GS-1273',
    token: '#1273',
    title: 'WEAKENED BOUNDARY WALL OF GOVT HIGH SCHOOL',
    letter: 'S',
    tag: 'SCHOOL SAFETY',
    tagClass: 'bg-amber-100 text-amber-800',
    location: 'Ashta Road • Doraha',
    category: 'Education Infrastructure',
    officerLabel: 'Executive Engineer',
    officer: 'RES Division Sehore',
    reportedDate: 'June 28, 2026',
    actionText: 'PENDING',
    actionClass: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    status: 'active',
    footerLeftIcon: 'none',
    footerLeftText: 'Caution cordon placed around 15m perimeter',
    footerLeftClass: '',
    footerRightText: 'Demolition and rebuild sanctioned'
  },
  {
    id: '#GS-1275',
    token: '#1275',
    title: 'MOSQUITO BREEDING IN STAGNANT STORM DRAIN',
    letter: 'M',
    tag: 'SANITATION',
    tagClass: 'bg-blue-100 text-blue-800',
    location: 'Ward 8 • Shyampur',
    category: 'Vector Control & Health',
    officerLabel: 'Sanitary Inspector',
    officer: 'Malaria Officer Cell',
    reportedDate: 'June 29, 2026',
    actionText: 'IN PROGRESS',
    actionClass: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    status: 'active',
    footerLeftIcon: 'clock',
    footerLeftText: 'Redressal SLA: 20h Remaining',
    footerLeftClass: 'flex items-center text-amber-700 font-bold',
    footerRightText: 'Larvicide chemical spray in progress'
  },

  // --- Resolved Grievances (24 items) ---
  {
    id: '#GS-1244',
    token: '#1244',
    title: 'BURNT DISTRIBUTION TRANSFORMER',
    letter: 'E',
    tag: 'VERIFIED CLOSED',
    tagClass: 'bg-blue-100 text-[#0F2A4A]',
    location: 'Bilkisganj Feeder #4',
    category: 'Electricity & Power Grid',
    officerLabel: 'Resolved by',
    officer: 'MPPKVVCL Junior Eng.',
    reportedDate: 'June 10, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Replacement unit 63kVA commissioned & verified',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Signed off on: June 12, 2026'
  },
  {
    id: '#GS-1239',
    token: '#1239',
    title: 'DAMAGED IRRIGATION CANAL SLUICE',
    letter: 'I',
    tag: 'WATER RESOURCE',
    tagClass: 'bg-cyan-100 text-cyan-900',
    location: 'Rehti Minor Canal Ch. 12+400 • Shyampur',
    category: 'Irrigation Infrastructure',
    officerLabel: 'Site Inspector',
    officer: 'SDO Irrigation',
    reportedDate: 'June 05, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Work Order Issued to M/s Bundelkhand Earthworks',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Gram Panchayat: Shyampur Kalan'
  },
  {
    id: '#GS-1235',
    token: '#1235',
    title: 'BROKEN TUBEWELL MOTOR REPLACEMENT',
    letter: 'T',
    tag: 'JAL NIGAM',
    tagClass: 'bg-blue-100 text-blue-900',
    location: 'Ward 1 • Rampur',
    category: 'Rural Water Supply',
    officerLabel: 'Resolved by',
    officer: 'PHED Maintenance Wing',
    reportedDate: 'June 03, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'New 7.5 HP submersible pump installed',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Signed off on: June 06, 2026'
  },
  {
    id: '#GS-1231',
    token: '#1231',
    title: 'REPLACEMENT OF 15 STREETLIGHT LED FIXTURES',
    letter: 'L',
    tag: 'PUBLIC LIGHTING',
    tagClass: 'bg-emerald-100 text-emerald-800',
    location: 'Gram Bilkisganj Bazaar',
    category: 'Civic Amenities',
    officerLabel: 'Completed by',
    officer: 'Panchayat Electrician Team',
    reportedDate: 'June 01, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Energy-saving 45W LEDs commissioned',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Citizen feedback: 100% satisfied'
  },
  {
    id: '#GS-1228',
    token: '#1228',
    title: 'DESILTING OF KACHHA NAALAH BEFORE MONSOON',
    letter: 'D',
    tag: 'FLOOD PREVENTION',
    tagClass: 'bg-amber-100 text-amber-900',
    location: 'Ward 4 • Shyampur',
    category: 'Drainage & Disaster Mgmt',
    officerLabel: 'Project Supervisor',
    officer: 'MNREGA Works Division',
    reportedDate: 'May 28, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: '2.4 km drainage cleared of silt & debris',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Verified by Sarpanch Shyampur'
  },
  {
    id: '#GS-1224',
    token: '#1224',
    title: 'VACCINATION REFRIGERATOR TEMPERATURE AUDIT',
    letter: 'V',
    tag: 'PUBLIC HEALTH',
    tagClass: 'bg-red-100 text-red-800',
    location: 'Doraha Primary Health Centre',
    category: 'Health Department',
    officerLabel: 'Audited by',
    officer: 'Chief Medical Officer Cell',
    reportedDate: 'May 25, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Solar battery inverter re-calibrated',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Signed off on: May 26, 2026'
  },
  {
    id: '#GS-1220',
    token: '#1220',
    title: 'RESURFACING OF APPROACH ROAD TO GRAIN MANDI',
    letter: 'M',
    tag: 'MANDI BOARD',
    tagClass: 'bg-slate-100 text-slate-800',
    location: 'Krishi Upaj Mandi • Sehore',
    category: 'Roads & Infrastructure',
    officerLabel: 'Engineer',
    officer: 'PWD Sehore Division',
    reportedDate: 'May 20, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Bitumen tarring completed on 800m stretch',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Heavy truck movement restored'
  },
  {
    id: '#GS-1216',
    token: '#1216',
    title: 'MID-DAY MEAL SHED ROOF REPAIR',
    letter: 'S',
    tag: 'EDUCATION',
    tagClass: 'bg-purple-100 text-purple-800',
    location: 'Govt Primary School • Rampur',
    category: 'School Education',
    officerLabel: 'Inspected by',
    officer: 'School Management Committee',
    reportedDate: 'May 16, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'GI tin sheets replaced & painted',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Headmaster sign-off received'
  },
  {
    id: '#GS-1212',
    token: '#1212',
    title: 'COMMUNITY TOILET WATER SUPPLY RESTORATION',
    letter: 'C',
    tag: 'SWACHH BHARAT',
    tagClass: 'bg-emerald-100 text-emerald-800',
    location: 'Bus Stand • Bilkisganj',
    category: 'Sanitation',
    officerLabel: 'Inspector',
    officer: 'Sanitation Inspector Sehore',
    reportedDate: 'May 12, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: '1000L PVC overhead tank fitted',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Signed off on: May 14, 2026'
  },
  {
    id: '#GS-1209',
    token: '#1209',
    title: 'HAZARDOUS LEANING ELECTRIC POLE RE-ALIGNMENT',
    letter: 'E',
    tag: 'POWER GRID',
    tagClass: 'bg-blue-100 text-blue-900',
    location: 'Shyampur Highway Turn',
    category: 'Electricity Board',
    officerLabel: 'Supervisor',
    officer: 'Lineman Flying Squad',
    reportedDate: 'May 08, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Concrete footing reinforced & stay-wire tightened',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'High risk hazard neutralized'
  },
  {
    id: '#GS-1205',
    token: '#1205',
    title: 'CLEARANCE OF FALLEN TREE BLOCKING BUS ROUTE',
    letter: 'T',
    tag: 'DISASTER MGMT',
    tagClass: 'bg-green-100 text-green-900',
    location: 'Doraha Bypass Road',
    category: 'Forest & Highways',
    officerLabel: 'Officer',
    officer: 'Quick Response Team',
    reportedDate: 'May 04, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Tree cleared within 90 minutes of log',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Traffic normalized'
  },
  {
    id: '#GS-1201',
    token: '#1201',
    title: 'NEW HANDPUMP RISER PIPE INSTALLATION',
    letter: 'H',
    tag: 'WATER SUPPLY',
    tagClass: 'bg-cyan-100 text-cyan-800',
    location: 'Bhil Basti • Ashta',
    category: 'Drinking Water',
    officerLabel: 'Technician',
    officer: 'PHED Rig Unit #04',
    reportedDate: 'April 29, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: '90 ft GI riser pipe lowered and water tested',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Signed off on: May 02, 2026'
  },
  {
    id: '#GS-1198',
    token: '#1198',
    title: 'ANGANWADI CHAT-DAR REPAIR & WHITEWASH',
    letter: 'A',
    tag: 'CHILD CARE',
    tagClass: 'bg-pink-100 text-pink-900',
    location: 'Ward 7 • Ichhawar',
    category: 'Women & Child Dev',
    officerLabel: 'Supervised by',
    officer: 'Gram Panchayat Sachiv',
    reportedDate: 'April 25, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Plastering and waterproof distemper completed',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Verified by CDPO Sehore'
  },
  {
    id: '#GS-1195',
    token: '#1195',
    title: 'DRINKING WATER CHLORINATION DRIVE',
    letter: 'W',
    tag: 'PUBLIC HEALTH',
    tagClass: 'bg-blue-100 text-[#0F2A4A]',
    location: 'All 5 Wards • Rampur',
    category: 'Health & Sanitation',
    officerLabel: 'Drive Lead',
    officer: 'ASHA & VDO Cell',
    reportedDate: 'April 20, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: '18 open wells & 6 tanks disinfected',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Zero waterborne illness recorded'
  },
  {
    id: '#GS-1192',
    token: '#1192',
    title: 'CONCRETING OF DRAIN CROSSING AT TEMPLE LANE',
    letter: 'D',
    tag: 'LOCAL WORKS',
    tagClass: 'bg-slate-100 text-slate-800',
    location: 'Bilkisganj Mandir Marg',
    category: 'Panchayat Infrastructure',
    officerLabel: 'Contractor',
    officer: 'Panchayat Civil Cell',
    reportedDate: 'April 15, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Reinforced concrete culvert slab cast',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Signed off on: April 18, 2026'
  },
  {
    id: '#GS-1189',
    token: '#1189',
    title: 'SUB-STATION CAPACITOR BANK REPAIR',
    letter: 'P',
    tag: 'POWER GRID',
    tagClass: 'bg-blue-100 text-blue-900',
    location: 'Sehore Rural Sub-station',
    category: 'Electricity Transmission',
    officerLabel: 'Engineer',
    officer: 'MPPKVVCL Testing Div',
    reportedDate: 'April 10, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Power factor stabilized at 0.98',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Grid compliance passed'
  },
  {
    id: '#GS-1185',
    token: '#1185',
    title: 'CATTLE TROUGH WATER INLET REPAIR',
    letter: 'G',
    tag: 'ANIMAL HUSBANDRY',
    tagClass: 'bg-emerald-100 text-emerald-800',
    location: 'Gaushala • Shyampur',
    category: 'Rural Development',
    officerLabel: 'Inspector',
    officer: 'Veterinary Extension Cell',
    reportedDate: 'April 05, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Automatic float ball valve replaced',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Fresh water supply restored for 200 cattle'
  },
  {
    id: '#GS-1182',
    token: '#1182',
    title: 'SPEED BREAKER INSTALLATION NEAR PRIMARY SCHOOL',
    letter: 'R',
    tag: 'ROAD SAFETY',
    tagClass: 'bg-amber-100 text-amber-800',
    location: 'Main Road • Doraha',
    category: 'Traffic & PWD',
    officerLabel: 'PWD Engineer',
    officer: 'PWD Sub-division Ashta',
    reportedDate: 'March 30, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Two rumble strips & reflective zebra signs erected',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'School committee satisfaction confirmed'
  },
  {
    id: '#GS-1179',
    token: '#1179',
    title: 'GRAM PANCHAYAT SEWA KENDRA INTERNET RESTORATION',
    letter: 'I',
    tag: 'DIGITAL INDIA',
    tagClass: 'bg-indigo-100 text-indigo-900',
    location: 'Panchayat Bhavan • Rampur',
    category: 'E-Governance',
    officerLabel: 'Lead Tech',
    officer: 'BSNL BharatNet Cell',
    reportedDate: 'March 25, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Underground optical fiber splice completed',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Certificate issuance portal back online'
  },
  {
    id: '#GS-1175',
    token: '#1175',
    title: 'PUBLIC WELL CLEANING & BLEACHING DISINFECTION',
    letter: 'W',
    tag: 'WATER SAFETY',
    tagClass: 'bg-blue-100 text-blue-900',
    location: 'Ward 2 • Bilkisganj',
    category: 'Drinking Water',
    officerLabel: 'Sanitation Lead',
    officer: 'Panchayat Swachhta Cell',
    reportedDate: 'March 20, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'De-silted & 5kg bleaching powder dissolved',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Water clarity test approved'
  },
  {
    id: '#GS-1172',
    token: '#1172',
    title: 'DAMAGED CHECK DAM GATES REPLACED',
    letter: 'C',
    tag: 'WATERSHED',
    tagClass: 'bg-cyan-100 text-cyan-900',
    location: 'Chambal Nala • Ichhawar',
    category: 'Water Conservation',
    officerLabel: 'Project Officer',
    officer: 'Watershed Development Dept',
    reportedDate: 'March 15, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: '3 mild steel shutter gates installed',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Groundwater recharge capacity boosted'
  },
  {
    id: '#GS-1168',
    token: '#1168',
    title: 'MOSQUITO FOGGING DRIVE IN FLOOD-PRONE WARDS',
    letter: 'M',
    tag: 'HEALTH DRIVE',
    tagClass: 'bg-emerald-100 text-emerald-800',
    location: 'Wards 1, 3, 5 • Shyampur',
    category: 'Public Health',
    officerLabel: 'Health Officer',
    officer: 'Block Health Unit',
    reportedDate: 'March 10, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Thermal fogging completed across 450 houses',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Signed off on: March 12, 2026'
  },
  {
    id: '#GS-1165',
    token: '#1165',
    title: 'REPAIR OF SOLAR WATER HEATER AT COMMUNITY CLINIC',
    letter: 'S',
    tag: 'SOLAR',
    tagClass: 'bg-amber-100 text-amber-900',
    location: 'Doraha Community Health Clinic',
    category: 'Renewable Infrastructure',
    officerLabel: 'Technician',
    officer: 'MPUVNL Authorized Vendor',
    reportedDate: 'March 05, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Evacuated tube collector array replaced',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Maternity ward hot water restored'
  },
  {
    id: '#GS-1160',
    token: '#1160',
    title: 'STREETLIGHT TIMER PANEL OVERHAUL',
    letter: 'E',
    tag: 'ELECTRICAL',
    tagClass: 'bg-blue-100 text-blue-900',
    location: 'Market Circle • Rampur',
    category: 'Municipal Infrastructure',
    officerLabel: 'Junior Engineer',
    officer: 'MPPKVVCL Rural Maintenance',
    reportedDate: 'March 01, 2026',
    actionText: 'RESOLVED',
    actionClass: 'bg-[#0F2A4A] text-white',
    status: 'resolved',
    footerLeftIcon: 'check',
    footerLeftText: 'Digital astronomical timer switch programmed',
    footerLeftClass: 'text-emerald-700 font-bold flex items-center',
    footerRightText: 'Automatic dusk-to-dawn switching active'
  }
];

export const OfficialProfile: React.FC = () => {
  const { setSelectedIssueId, setOfficialTab } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  const handleFilterChange = (newFilter: 'all' | 'active' | 'resolved') => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const filteredGrievances = ALL_JURISDICTION_GRIEVANCES.filter(item => {
    if (filter === 'active') return item.status === 'active';
    if (filter === 'resolved') return item.status === 'resolved';
    return true;
  });

  const totalItems = filteredGrievances.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentGrievances = filteredGrievances.slice(startIndex, endIndex);

  // Generate pagination buttons window ensuring 1, 2, 3 are prominently available
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validCurrentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (validCurrentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols) matching screen.png */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {/* Avatar & Title */}
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Ramesh Sharma"
                className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 mx-auto shadow-xs"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <h2 className="text-lg font-black text-slate-900 mt-3">Ramesh Sharma</h2>
            <p className="text-xs text-slate-500">Block Administrator • Sehore District</p>

            <div className="mt-2 inline-block px-3 py-1 rounded bg-blue-100/70 text-[#0F2A4A] text-xs font-mono font-bold">
              OFFICER ID: #MP-SEH-0402
            </div>
          </div>

          {/* Assigned & Resolved Tiles */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-3xl font-black text-slate-900 block">38</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                ASSIGNED
              </span>
            </div>
            <div className="text-center p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-3xl font-black text-emerald-600 block">24</span>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                RESOLVED
              </span>
            </div>
          </div>

          {/* Official Credentials */}
          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              OFFICIAL CREDENTIALS
            </h3>
            <div className="flex justify-between">
              <span className="text-slate-500">Department</span>
              <span className="font-bold text-slate-800 text-right">Rural Dev & Panchayati Raj</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Jurisdiction</span>
              <span className="font-bold text-slate-800 text-right">Sehore (42 Panchayats)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Official Email</span>
              <span className="font-mono text-slate-800 text-right text-[11px]">ramesh.sharma@mp.gov.in</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sub-Division</span>
              <span className="font-bold text-slate-800 text-right">Madhya Kshetra Central</span>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              NOTIFICATION PREFERENCES
            </h3>
            <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#0F2A4A] focus:ring-[#0F2A4A]" />
              <span>Status Alerts on Grievance Updates</span>
            </label>
            <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#0F2A4A] focus:ring-[#0F2A4A]" />
              <span>Escalation Alerts (SLA Breaches)</span>
            </label>
            <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#0F2A4A] focus:ring-[#0F2A4A]" />
              <span>High-Priority Incident Warnings</span>
            </label>
            <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
              <input type="checkbox" className="rounded text-[#0F2A4A] focus:ring-[#0F2A4A]" />
              <span>Weekly Administrative Digests</span>
            </label>
          </div>

          {/* Footer badge */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
              NIC Verified Officer
            </span>
            <button className="font-bold text-[#0F2A4A] hover:underline cursor-pointer">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Right Column (8 cols): Assigned Jurisdiction Issues matching screen.png */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                MY ASSIGNED JURISDICTION ISSUES
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and trace active progress details for specific community complaints logged under your block oversight.
              </p>
            </div>

            {/* Filter Tabs matching screen.png */}
            <div className="inline-flex border border-slate-300 rounded-lg text-xs font-bold divide-x divide-slate-300 overflow-hidden shrink-0">
              <button
                type="button"
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1.5 cursor-pointer transition-colors ${filter === 'all' ? 'bg-blue-100 text-[#0F2A4A]' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                All (38)
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange('active')}
                className={`px-3 py-1.5 cursor-pointer transition-colors ${filter === 'active' ? 'bg-blue-100 text-[#0F2A4A]' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                Active (14)
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange('resolved')}
                className={`px-3 py-1.5 cursor-pointer transition-colors ${filter === 'resolved' ? 'bg-blue-100 text-[#0F2A4A]' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                Resolved (24)
              </button>
            </div>
          </div>

          {/* Dynamic Cards matching current page and filter */}
          <div className="space-y-4">
            {currentGrievances.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-500 text-sm">
                No administrative grievances found matching this category.
              </div>
            ) : (
              currentGrievances.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all space-y-3 bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                        {item.letter}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${item.tagClass}`}>
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.location} | Category: {item.category}
                        </p>
                        <p className="text-xs text-slate-700 mt-1">
                          Tracking Token ID: <strong>{item.token}</strong> • {item.officerLabel}: <strong>{item.officer}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-slate-400 block">Reported: {item.reportedDate}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIssueId(item.id);
                          setOfficialTab('issues');
                        }}
                        className={`mt-2 px-4 py-1 text-xs font-bold rounded cursor-pointer transition-all shadow-xs ${item.actionClass}`}
                      >
                        {item.actionText}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className={item.footerLeftClass || 'text-slate-600'}>
                      {item.footerLeftIcon === 'clock' && <Clock className="w-3.5 h-3.5 mr-1 inline-block" />}
                      {item.footerLeftIcon === 'check' && <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline-block text-emerald-600" />}
                      {item.footerLeftText}
                    </span>
                    <span>{item.footerRightText}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Interactive Pagination Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
            <span>
              Showing {totalItems === 0 ? 0 : startIndex + 1}-{endIndex} of {totalItems} assigned administrative grievances
            </span>
            <div className="flex items-center space-x-1">
              <button 
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={validCurrentPage === 1}
                className={`px-3 py-1 border border-slate-300 rounded font-bold transition-all ${
                  validCurrentPage === 1 
                    ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' 
                    : 'hover:bg-slate-50 text-slate-700 cursor-pointer'
                }`}
              >
                PREV
              </button>

              {getVisiblePages().map((pageNum, idx) => {
                if (pageNum === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400 font-bold">
                      ...
                    </span>
                  );
                }
                const pageNumber = pageNum as number;
                const isActive = validCurrentPage === pageNumber;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0F2A4A] text-white shadow-xs'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button 
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={validCurrentPage === totalPages}
                className={`px-3 py-1 border border-slate-300 rounded font-bold transition-all ${
                  validCurrentPage === totalPages 
                    ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' 
                    : 'hover:bg-slate-50 text-slate-700 cursor-pointer'
                }`}
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
