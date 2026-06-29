// ============================================
// SHARED DATA & HELPERS
// ============================================

export const INITIAL_TASKS = [
  { id: 'TSK-1', title: 'System Architecture Design', assignee: 'Dwi', status: 'In Progress', priority: 'High', description: 'Draft the initial system architecture including DB diagrams and microservice communication.', timeSpent: 3600, timerRunning: false },
  { id: 'TSK-2', title: 'Frontend UI Implementation', assignee: 'Ari', status: 'In Progress', priority: 'High', description: 'Translate Figma designs into React components using Tailwind CSS.', timeSpent: 0, timerRunning: false },
  { id: 'TSK-3', title: 'Backend API Setup', assignee: 'Ganesh', status: 'Backlog', priority: 'Medium', description: 'Set up Node.js Express server and define REST APIs.', timeSpent: 0, timerRunning: false },
  { id: 'TSK-4', title: 'Database Schema Design', assignee: 'Ganesh', status: 'Done', priority: 'High', description: 'Design PostgreSQL schema for users, tasks, and transactional data.', timeSpent: 7200, timerRunning: false },
  { id: 'TSK-5', title: '3D Enclosure Fabrication', assignee: 'Made', status: 'Review', priority: 'Low', description: 'Fabricate the high-precision casing on the digital 3D printing ecosystem.', timeSpent: 1200, timerRunning: false },
];

export const INITIAL_LEADS = [
  { id: 'LD-1', clientName: 'PT Maju Bersama', contact: 'Budi (CEO)', email: 'budi@ptmajubersama.co.id', status: 'Pitching', value: 150000000, brief: 'Redesign e-commerce platform & mobile app.' },
  { id: 'LD-2', clientName: 'TechNova Bali', contact: 'Sarah (CMO)', email: 'sarah@technova.io', status: 'Negosiasi Harga', value: 75000000, brief: 'Corporate company profile website.' },
  { id: 'LD-3', clientName: 'Urban Space', contact: 'Reza (Founder)', email: 'reza.founder@urbanspace.net', status: 'Closing', value: 350000000, brief: 'Custom agency dashboard & ERP.' },
];

export const INITIAL_TRANSACTIONS = [
  { id: 'TRX-1', type: 'Income', category: 'Project Invoice', description: 'Downpayment Urban Space', amount: 100000000, date: '2026-04-18' },
  { id: 'TRX-2', type: 'Expense', category: 'Infrastructure', description: 'AWS & Vercel Subs', amount: 2500000, date: '2026-04-10' },
  { id: 'TRX-3', type: 'Expense', category: 'Material', description: '3D Printing Filament & Resin', amount: 4800000, date: '2026-04-12' },
  { id: 'TRX-4', type: 'Income', category: 'Project Invoice', description: 'Final Payment PT Maju Bersama', amount: 50000000, date: '2026-04-15' },
  { id: 'TRX-5', type: 'Expense', category: 'Operational', description: 'Team Coffee & Software Subs', amount: 1200000, date: '2026-04-17' },
];

export const INITIAL_TEAM = [
  { id: 'TM-1', name: 'Ari', role: 'Lead Architect', status: 'Available', utilization: 80 },
  { id: 'TM-2', name: 'Made', role: '3D Specialist', status: 'Available', utilization: 50 },
  { id: 'TM-3', name: 'Dwi', role: 'UI/UX Designer', status: 'At Capacity', utilization: 95 },
  { id: 'TM-4', name: 'Ganesh', role: 'Backend Engineer', status: 'Available', utilization: 70 },
];

export const INITIAL_PROJECTS = [
  { id: 'PRJ-URBAN', name: 'Urban Space Custom ERP', client: 'Urban Space', progress: 72, phase: 'Development', budget: 350000000, profit: 245000000, riskScore: 'Low', hoursLogged: 120, status: 'Active', approvedMilestones: { design: true, invoice: false, milestone: true, deployment: false }, activityFeed: [
    { time: '11:40', text: 'Frontend development started.' },
    { time: '10:18', text: 'CEO approved Homepage.' },
    { time: '10:12', text: 'Designer uploaded Homepage.' }
  ] },
  { id: 'PRJ-MAJU', name: 'Maju Bersama E-commerce', client: 'PT Maju Bersama', progress: 45, phase: 'Design & UI/UX', budget: 150000000, profit: 90000000, riskScore: 'High', hoursLogged: 60, status: 'At Risk', approvedMilestones: { design: false, invoice: true, milestone: false, deployment: false }, activityFeed: [
    { time: '09:00', text: 'Database migration initiated.' },
    { time: 'Yesterday', text: 'Backend API design finalized.' }
  ] },
  { id: 'PRJ-TECHNO', name: 'TechNova Bali Profile', client: 'TechNova Bali', progress: 95, phase: 'Testing & QA', budget: 75000000, profit: 55000000, riskScore: 'Low', hoursLogged: 40, status: 'Active', approvedMilestones: { design: true, invoice: true, milestone: true, deployment: false }, activityFeed: [
    { time: '14:20', text: 'QA automated test suite completed.' },
    { time: 'Wednesday', text: 'Staging deployment verified.' }
  ] }
];

export const INITIAL_TRANSPARENCY_LOG = [
  { time: '14:20', text: 'QA automated test suite completed on TechNova Bali.' },
  { time: '11:40', text: 'Frontend development started on Urban Space Custom ERP.' },
  { time: '10:18', text: 'CEO approved Homepage on Urban Space Custom ERP.' },
  { time: '10:12', text: 'Designer uploaded Homepage on Urban Space Custom ERP.' }
];

export const formatTime = (totalSeconds) => {
  if (!totalSeconds || totalSeconds <= 0) return '00:00:00';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};
