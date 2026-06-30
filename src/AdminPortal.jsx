import React, { useState } from 'react';

const AdminPortal = ({
  projects,
  setProjects,
  leads,
  setLeads,
  transactions,
  setTransactions,
  team,
  setTeam,
  transparencyLog,
  setTransparencyLog,
  onBackHome,
  publicWorks,
  setPublicWorks,
  partnerships,
  setPartnerships
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  // Forms state
  const [publishTargetProject, setPublishTargetProject] = useState('PRJ-URBAN');
  const [publishMessage, setPublishMessage] = useState('');

  // AI Chat Terminal State
  const [aiInput, setAiInput] = useState('');
  const [aiFeed, setAiFeed] = useState([
    { sender: 'AI', text: 'Consolidating operational cache. Agency OS v2.0 AI Brain online. Ask me anything.' }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // AI Pitch outreach generator simulation
  const [activePitchLead, setActivePitchLead] = useState(null);
  const [pitchText, setPitchText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Alert State
  const [alertMsg, setAlertMsg] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('ceo_overview');

  // Leads CRUD States
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [leadForm, setLeadForm] = useState({ clientName: '', contact: '', email: '', brief: '', value: 0, status: 'Draft' });

  // Projects CRUD States
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({ name: '', client: '', progress: 0, phase: 'Design', budget: 0, profit: 0, riskScore: 'Low', status: 'Draft' });

  // Transactions CRUD States
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [transactionForm, setTransactionForm] = useState({ type: 'Income', category: '', description: '', amount: 0, date: new Date().toISOString().split('T')[0] });

  // Team CRUD States
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [teamForm, setTeamForm] = useState({ name: '', role: '', status: 'Available', utilization: 50 });

  // BI Platform View State
  const [selectedBiPlatform, setSelectedBiPlatform] = useState('looker'); // 'looker' | 'powerbi' | 'tableau'
  const [isSyncingBi, setIsSyncingBi] = useState(false);

  // Works Content management
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState(null);
  const [workForm, setWorkForm] = useState({ 
    title: '', 
    type: 'client',
    tags: '', 
    desc_id: '', 
    desc_en: '', 
    link: '', 
    image: '',
    problem_id: '',
    problem_en: '',
    solution_id: '',
    solution_en: '',
    result_id: '',
    result_en: ''
  });

  // Partnerships Content management
  const [isAddingPartnership, setIsAddingPartnership] = useState(false);
  const [editingPartnershipId, setEditingPartnershipId] = useState(null);
  const [partnershipForm, setPartnershipForm] = useState({ title_id: '', title_en: '', desc_id: '', desc_en: '' });

  const triggerAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 2500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '123123') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Kredensial tidak valid / Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    onBackHome();
  };

  // Works CRUD Handlers
  const handleSaveWork = (e) => {
    e.preventDefault();
    const tagsArr = typeof workForm.tags === 'string' 
      ? workForm.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
      : workForm.tags;
    if (editingWorkId) {
      setPublicWorks(prev => prev.map(w => w.id === editingWorkId ? { ...w, ...workForm, tags: tagsArr } : w));
      triggerAlert('Selected Work updated successfully!');
    } else {
      const newWork = {
        ...workForm,
        tags: tagsArr,
        id: 'work-' + Date.now().toString().slice(-4)
      };
      setPublicWorks(prev => [...prev, newWork]);
      triggerAlert('Selected Work added successfully!');
    }
    setWorkForm({ 
      title: '', 
      type: 'client',
      tags: '', 
      desc_id: '', 
      desc_en: '', 
      link: '', 
      image: '',
      problem_id: '',
      problem_en: '',
      solution_id: '',
      solution_en: '',
      result_id: '',
      result_en: ''
    });
    setIsAddingWork(false);
    setEditingWorkId(null);
  };

  const handleEditWork = (work) => {
    setEditingWorkId(work.id);
    setWorkForm({
      title: work.title || '',
      type: work.type || 'client',
      tags: Array.isArray(work.tags) ? work.tags.join(', ') : '',
      desc_id: work.desc_id || '',
      desc_en: work.desc_en || '',
      link: work.link || '',
      image: work.image || '',
      problem_id: work.problem_id || '',
      problem_en: work.problem_en || '',
      solution_id: work.solution_id || '',
      solution_en: work.solution_en || '',
      result_id: work.result_id || '',
      result_en: work.result_en || ''
    });
    setIsAddingWork(true);
  };

  const handleDeleteWork = (id) => {
    if (window.confirm('Delete this selected work?')) {
      setPublicWorks(prev => prev.filter(w => w.id !== id));
      triggerAlert('Selected Work deleted successfully!');
    }
  };

  // Partnerships CRUD Handlers
  const handleSavePartnership = (e) => {
    e.preventDefault();
    if (editingPartnershipId) {
      setPartnerships(prev => prev.map(p => p.id === editingPartnershipId ? { ...p, ...partnershipForm } : p));
      triggerAlert('Partnership updated successfully!');
    } else {
      const newPart = {
        ...partnershipForm,
        id: 'part-' + Date.now().toString().slice(-4)
      };
      setPartnerships(prev => [...prev, newPart]);
      triggerAlert('Partnership added successfully!');
    }
    setPartnershipForm({ title_id: '', title_en: '', desc_id: '', desc_en: '' });
    setIsAddingPartnership(false);
    setEditingPartnershipId(null);
  };

  const handleEditPartnership = (partner) => {
    setEditingPartnershipId(partner.id);
    setPartnershipForm({
      title_id: partner.title_id || '',
      title_en: partner.title_en || '',
      desc_id: partner.desc_id || '',
      desc_en: partner.desc_en || ''
    });
    setIsAddingPartnership(true);
  };

  const handleDeletePartnership = (id) => {
    if (window.confirm('Delete this partnership?')) {
      setPartnerships(prev => prev.filter(p => p.id !== id));
      triggerAlert('Partnership deleted successfully!');
    }
  };

  // Leads Handlers
  const handleSaveLead = (e) => {
    e.preventDefault();
    if (editingLeadId) {
      setLeads(prev => prev.map(l => l.id === editingLeadId ? { ...l, ...leadForm, value: Number(leadForm.value) } : l));
      triggerAlert('Lead updated successfully!');
    } else {
      const newLead = { ...leadForm, value: Number(leadForm.value), id: 'LD-' + Date.now().toString().slice(-4) };
      setLeads(prev => [...prev, newLead]);
      triggerAlert('Lead added successfully!');
    }
    setLeadForm({ clientName: '', contact: '', email: '', brief: '', value: 0, status: 'Draft' });
    setIsAddingLead(false);
    setEditingLeadId(null);
  };

  const handleEditLead = (lead) => {
    setEditingLeadId(lead.id);
    setLeadForm({ clientName: lead.clientName, contact: lead.contact, email: lead.email, brief: lead.brief, value: lead.value, status: lead.status });
    setIsAddingLead(true);
  };

  const handleDeleteLead = (id) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    triggerAlert('Lead deleted successfully!');
  };

  // Projects Handlers
  const handleSaveProject = (e) => {
    e.preventDefault();
    if (editingProjectId) {
      setProjects(prev => prev.map(p => p.id === editingProjectId ? { ...p, ...projectForm, progress: Number(projectForm.progress), budget: Number(projectForm.budget), profit: Number(projectForm.profit) } : p));
      triggerAlert('Project updated successfully!');
    } else {
      const newProj = {
        ...projectForm,
        id: 'PRJ-' + projectForm.name.substring(0, 5).toUpperCase().replace(/\s+/g, '') + '-' + Date.now().toString().slice(-4),
        progress: Number(projectForm.progress),
        budget: Number(projectForm.budget),
        profit: Number(projectForm.profit),
        approvedMilestones: { design: false, invoice: false, milestone: false, deployment: false },
        activityFeed: [{ time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), text: 'Project initialized.' }]
      };
      setProjects(prev => [...prev, newProj]);
      triggerAlert('Project initialized successfully!');
    }
    setProjectForm({ name: '', client: '', progress: 0, phase: 'Design', budget: 0, profit: 0, riskScore: 'Low', status: 'Draft' });
    setIsAddingProject(false);
    setEditingProjectId(null);
  };

  const handleEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      name: proj.name,
      client: proj.client,
      progress: proj.progress,
      phase: proj.phase,
      budget: proj.budget,
      profit: proj.profit,
      riskScore: proj.riskScore,
      status: proj.status
    });
    setIsAddingProject(true);
  };

  const handleDeleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    triggerAlert('Project deleted successfully!');
  };

  // Transactions Handlers
  const handleSaveTransaction = (e) => {
    e.preventDefault();
    if (editingTransactionId) {
      setTransactions(prev => prev.map(t => t.id === editingTransactionId ? { ...t, ...transactionForm, amount: Number(transactionForm.amount) } : t));
      triggerAlert('Transaction updated!');
    } else {
      const newTrx = { ...transactionForm, amount: Number(transactionForm.amount), id: 'TRX-' + Date.now().toString().slice(-4) };
      setTransactions(prev => [newTrx, ...prev]);
      triggerAlert('Transaction recorded!');
    }
    setTransactionForm({ type: 'Income', category: '', description: '', amount: 0, date: new Date().toISOString().split('T')[0] });
    setIsAddingTransaction(false);
    setEditingTransactionId(null);
  };

  const handleEditTransaction = (trx) => {
    setEditingTransactionId(trx.id);
    setTransactionForm({
      type: trx.type,
      category: trx.category,
      description: trx.description,
      amount: trx.amount,
      date: trx.date
    });
    setIsAddingTransaction(true);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    triggerAlert('Transaction removed.');
  };

  // Team Handlers
  const handleSaveTeam = (e) => {
    e.preventDefault();
    if (editingTeamId) {
      setTeam(prev => prev.map(t => t.id === editingTeamId ? { ...t, ...teamForm, utilization: Number(teamForm.utilization) } : t));
      triggerAlert('Team member updated!');
    } else {
      const newMember = { ...teamForm, utilization: Number(teamForm.utilization), id: 'TM-' + Date.now().toString().slice(-4) };
      setTeam(prev => [...prev, newMember]);
      triggerAlert('Team member registered!');
    }
    setTeamForm({ name: '', role: '', status: 'Available', utilization: 50 });
    setIsAddingTeam(false);
    setEditingTeamId(null);
  };

  const handleEditTeam = (member) => {
    setEditingTeamId(member.id);
    setTeamForm({
      name: member.name,
      role: member.role,
      status: member.status,
      utilization: member.utilization
    });
    setIsAddingTeam(true);
  };

  const handleDeleteTeam = (id) => {
    setTeam(prev => prev.filter(t => t.id !== id));
    triggerAlert('Team member removed.');
  };

  const handlePublishUpdate = (e) => {
    e.preventDefault();
    if (!publishMessage.trim()) return;

    const timeString = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    setProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id === publishTargetProject) {
          return {
            ...p,
            activityFeed: [
              { time: timeString, text: publishMessage },
              ...p.activityFeed
            ]
          };
        }
        return p;
      })
    );

    setTransparencyLog(prev => [
      { time: timeString, text: `[UPDATE PUBLISHED] Project ${publishTargetProject}: ${publishMessage}` },
      ...prev
    ]);

    setPublishMessage('');
    triggerAlert('Update successfully published to Client Portal!');
  };

  const startAiPitch = (lead) => {
    setActivePitchLead(lead);
    setIsTyping(true);
    setPitchText('');

    const template = `Yth. Hubungan Client di ${lead.clientName},\n\nKami menganalisis brief Anda: "${lead.brief}" dengan deal value estimasi Rp ${(lead.value / 1000000).toFixed(0)} Juta.\n\nDGT_LZ mengusulkan blueprint otomatisasi data untuk memangkas 98% alur kerja manual Anda.\n\nMari jadwalkan audit teknis otonom tanpa biaya minggu ini.\n\nSalam,\nDGT_LZ Autonomous Compiler`;

    let i = 0;
    const interval = setInterval(() => {
      setPitchText(prev => prev + template.charAt(i));
      i++;
      if (i >= template.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);
  };

  // AI GPT Answer Engine (Dynamic Live Data queries)
  const askAiBrain = (queryText) => {
    if (!queryText.trim()) return;

    setAiFeed(prev => [...prev, { sender: 'User', text: queryText }]);
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = "I'm processing this query against the Live Shared Data Layer. Can you please choose one of the predefined blueprints or ask about risk, timeline, team capacity, or finances?";

      const q = queryText.toLowerCase();
      if (q.includes('risk') || q.includes('masalah') || q.includes('bahaya')) {
        const atRisk = projects.filter(p => p.status === 'At Risk' || p.riskScore === 'High');
        if (atRisk.length > 0) {
          reply = `AI DIAGNOSTIC: Project "${atRisk[0].name}" is currently flagged AT RISK with score "${atRisk[0].riskScore}". Phase: ${atRisk[0].phase}. Recommend allocating Ari or Made to balance capacity.`;
        } else {
          reply = "AI DIAGNOSTIC: All operational pipelines are currently running normally. No projects at risk.";
        }
      } else if (q.includes('launch') || q.includes('when') || q.includes('timeline') || q.includes('proyek') || q.includes('project')) {
        const list = projects.map(p => `- ${p.name} (${p.phase}): ${p.progress}% completed`).join('\n');
        reply = `PROJECT ROADMAP ANALYSIS:\n${list}`;
      } else if (q.includes('proposal') || q.includes('generate')) {
        const targetLead = leads[0] || { clientName: 'PT Maju Bersama', value: 150000000, brief: 'E-commerce platform' };
        reply = `PROPOSAL GENERATOR:\n\n# DIGITAL ARCHITECTURE AUDIT PROPOSAL\n- Client: ${targetLead.clientName}\n- Proposed Budget: Rp ${targetLead.value.toLocaleString('id-ID')}\n- Deliverables: ${targetLead.brief}\n- Timeline: 4 Weeks.\n- Volcan Terracotta enclosures included.`;
      } else if (q.includes('finance') || q.includes('keuangan') || q.includes('revenue') || q.includes('expenses') || q.includes('mrr') || q.includes('uang') || q.includes('omset') || q.includes('profit')) {
        const totalPipeline = leads.reduce((sum, l) => sum + l.value, 0);
        const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
        const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
        reply = `FINANCIAL HEALTH SUMMARY:\n- Pipeline CRM Value: Rp ${totalPipeline.toLocaleString('id-ID')}\n- Total Income (Ledger): Rp ${totalIncome.toLocaleString('id-ID')}\n- Total Expenses (Ledger): Rp ${totalExpenses.toLocaleString('id-ID')}\n- Net Profit: Rp ${(totalIncome - totalExpenses).toLocaleString('id-ID')}`;
      } else if (q.includes('team') || q.includes('tim') || q.includes('kapasitas') || q.includes('utilization')) {
        const list = team.map(t => `- ${t.name} (${t.role}): Allocation ${t.utilization}% [${t.status}]`).join('\n');
        reply = `TEAM CAPACITY REPORT:\n${list}`;
      }

      setAiFeed(prev => [...prev, { sender: 'AI', text: reply }]);
      setIsAiThinking(false);
    }, 600);

    setAiInput('');
  };

  const pipelineValueTotal = leads.reduce((sum, l) => sum + l.value, 0);
  const expenses = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);

  // Dynamic calculations for CAC and Cash Runway
  // Starting Cash Reservoir (e.g. Rp 450.000.000) + Net Operating Income
  const baseCashPool = 450000000;
  const currentTotalCash = baseCashPool + (totalIncome - expenses);
  const monthlyBurnRate = 38000000; // Rp 38.000.000 default burn rate
  const cashRunwayMonths = monthlyBurnRate > 0 ? (currentTotalCash / monthlyBurnRate).toFixed(1) : '0';

  // CAC: Sum marketing & operational spend divided by active clients
  const marketingAndSalesSpend = transactions
    .filter(t => t.category === 'Infrastructure' || t.category === 'Operational' || t.category === 'Material')
    .reduce((sum, t) => sum + t.amount, 0) + 12000000; // base sales & marketing overhead
  const activeClientsCount = projects.length || 3;
  const calculatedCacVal = activeClientsCount > 0 ? Math.round(marketingAndSalesSpend / activeClientsCount) : 4800000;

  // LTV: Total portfolio budget divided by number of projects
  const totalClientLtv = projects.reduce((sum, p) => sum + p.budget, 0);
  const averageLtvVal = activeClientsCount > 0 ? Math.round(totalClientLtv / activeClientsCount) : 150000000;
  const ltvCacRatioVal = calculatedCacVal > 0 ? (averageLtvVal / calculatedCacVal).toFixed(1) : '3.5';

  const getNavItems = () => [
    { id: 'ceo_overview', number: '01', label: 'Overview' },
    { id: 'ceo_crm', number: '02', label: 'CRM & Pipeline' },
    { id: 'ceo_projects', number: '03', label: 'Project Oversight' },
    { id: 'ceo_publish', number: '04', label: 'Publish Center' },
    { id: 'ceo_transparency', number: '05', label: 'Transparency' },
    { id: 'ai_brain', number: '06', label: 'AI Brain' },
    { id: 'ai_blueprints', number: '07', label: 'Prompt Blueprints' },
    { id: 'ceo_web_manager', number: '08', label: 'Web Content' }
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative font-sans">
        <button
          onClick={onBackHome}
          className="absolute top-6 left-6 text-[#737373] hover:text-[#FAFAFA] font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          ← Home
        </button>

        <div className="w-full max-w-sm border border-[#151515] bg-[#050505] p-8 flex flex-col gap-6 rounded shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col gap-1 border-b border-[#151515] pb-4">
            <span className="text-[10px] font-mono text-[#D46B4A] uppercase tracking-widest font-bold">SYSTEM ACCESS</span>
            <h2 className="text-xl font-clash text-[#FAFAFA]">CEO Command Center</h2>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] text-[#737373] font-mono uppercase tracking-wider font-bold">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="bg-[#0A0A0A] border border-[#151515] focus:border-[#D46B4A] outline-none py-2 px-3 text-[#FAFAFA] text-xs font-mono transition-all duration-300 placeholder:text-[#737373]/50"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] text-[#737373] font-mono uppercase tracking-wider font-bold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-[#0A0A0A] border border-[#151515] focus:border-[#D46B4A] outline-none py-2 px-3 text-[#FAFAFA] text-xs font-mono transition-all duration-300 placeholder:text-[#737373]/50"
                required
              />
            </div>

            {error && (
              <span className="text-[10px] text-red-500 font-mono tracking-wide">{error}</span>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#D46B4A] hover:bg-[#c25a3a] text-white font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded mt-2"
            >
              Access Command Center
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0D0D0D] text-[#FAFAFA] overflow-hidden font-sans selection:bg-[#D46B4A] selection:text-white transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-[#151515] flex items-center justify-between px-4 sm:px-8 h-[80px] shrink-0 z-20 bg-[#0D0D0D]">
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="font-maroni text-2xl sm:text-[38px] leading-none tracking-[-1px] m-0 p-0 text-[#FAFAFA] hover:text-[#D46B4A] transition-colors cursor-pointer select-none">
            Agency OS.
          </h1>
          <span className="text-[8px] font-mono text-[#D46B4A] border border-[#D46B4A]/20 px-2 py-0.5 rounded bg-[#D46B4A]/5 uppercase tracking-widest font-bold">V2.0</span>
          <span className="hidden sm:inline text-[9px] font-mono text-[#737373] uppercase tracking-wider pl-2 border-l border-[#151515] font-bold">CEO Portal</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="text-[9px] uppercase font-bold tracking-widest text-[#737373] hover:text-[#FAFAFA] transition-colors border border-[#151515] hover:border-red-500/50 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden relative">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-[300px] border-b lg:border-b-0 lg:border-r border-[#151515] flex flex-row lg:flex-col p-4 lg:p-8 shrink-0 bg-[#0D0D0D] overflow-x-auto lg:overflow-y-auto no-scrollbar relative">
          <span className="hidden lg:block" style={{ writingMode: 'vertical-rl', position: 'absolute', right: '-10px', top: '100px', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.15, fontFamily: 'monospace' }}>
            AGENCY CONSOLE
          </span>
          <nav className="flex flex-row lg:flex-col gap-4 lg:gap-6 mt-0 lg:mt-4 w-full">
            {getNavItems().map(item => {
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  className={`flex flex-row lg:flex-col items-baseline lg:items-start text-left group border-b lg:border-b border-transparent lg:border-[#151515] pb-1 lg:pb-3 shrink-0 gap-2 lg:gap-0 ${isActive ? 'opacity-100 border-[#D46B4A]' : 'opacity-40 hover:opacity-100'} transition-all`}
                >
                  <span className="font-clash italic text-[10px] lg:text-xs opacity-50 block text-[#D46B4A]">{item.number}</span>
                  <span className={`font-clash text-sm lg:text-[22px] leading-tight whitespace-nowrap lg:whitespace-normal ${isActive ? 'text-[#D46B4A]' : 'text-[#FAFAFA]'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Tab Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-12 relative w-full">
          {/* ALERT BOX */}
          {alertMsg && (
            <div className="fixed top-6 right-6 bg-[#0E0E0E] border border-[#D46B4A]/60 text-[#FAFAFA] font-mono text-[9px] uppercase font-bold tracking-widest py-3 px-5 z-[999] rounded">
              ⚡ {alertMsg}
            </div>
          )}

          {activeSubTab === 'ceo_overview' && (
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">CEO // OVERVIEW</span>
                  <h3 className="text-3xl font-syne font-extrabold tracking-tight text-[#FAFAFA]">Executive Summary</h3>
                </div>
                <button
                  onClick={() => {
                    setIsAddingTeam(true);
                    setEditingTeamId(null);
                    setTeamForm({ name: '', role: '', status: 'Available', utilization: 50 });
                  }}
                  className="bg-[#D46B4A] hover:bg-[#c25a3a] text-white font-mono text-[9px] font-bold px-3 py-1.5 uppercase rounded"
                >
                  + Add Team Member
                </button>
              </div>

              {isAddingTeam && (
                <div className="border border-[#151515] p-5 bg-[#070707] rounded max-w-md">
                  <form onSubmit={handleSaveTeam} className="flex flex-col gap-3 font-mono text-[9px]">
                    <span className="text-[#D46B4A] font-bold uppercase">{editingTeamId ? 'Edit Team Member' : 'Register New Team Member'}</span>
                    <input
                      type="text"
                      placeholder="Name"
                      value={teamForm.name}
                      onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. Lead Architect)"
                      value={teamForm.role}
                      onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <select
                      value={teamForm.status}
                      onChange={(e) => setTeamForm({ ...teamForm, status: e.target.value })}
                      className="bg-[#050505] border border-[#151515] outline-none p-2 text-white"
                    >
                      <option value="Available">Available</option>
                      <option value="At Capacity">At Capacity</option>
                      <option value="Leave">Leave</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Utilization (%)"
                      value={teamForm.utilization}
                      onChange={(e) => setTeamForm({ ...teamForm, utilization: Number(e.target.value) })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                      min="0"
                      max="100"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-[#D46B4A] text-white px-4 py-2 font-bold uppercase rounded">Save</button>
                      <button type="button" onClick={() => setIsAddingTeam(false)} className="border border-[#151515] text-[#737373] px-4 py-2 font-bold uppercase rounded">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* SYSTEM EXECUTIVE BRIEFING (QUICK WORDS) */}
              <div className="border border-[#151515] bg-[#070707] p-4 rounded border-l-2 border-l-[#D46B4A]">
                <span className="text-[8px] font-mono text-[#D46B4A] block uppercase font-bold tracking-wider mb-2">⚡ SYSTEM EXECUTIVE BRIEFING</span>
                <div className="font-mono text-[9px] text-[#FAFAFA] leading-relaxed flex flex-col gap-1.5">
                  <p>▪ Your <span className="text-green-400 font-bold">Cash Runway is healthy ({cashRunwayMonths} months)</span> based on active ledger cash reserves.</p>
                  <p>▪ Your marketing channels are highly optimized with a <span className="text-green-400 font-bold">CAC of Rp {calculatedCacVal.toLocaleString('id-ID')}</span> (LTV/CAC ratio of {ltvCacRatioVal}x is highly efficient).</p>
                  <p>▪ Your retention rate is currently at <span className="text-yellow-400 font-bold">92%</span>, which is slightly below your target of 95%.</p>
                  <p>▪ <span className="text-red-400 animate-pulse font-bold">Action Required:</span> Your Maju Bersama project is currently flagged as At Risk due to an unapproved design milestone and a High Risk Score warning.</p>
                </div>
              </div>

              {/* 5-SECOND CEO HEALTH RADAR */}
              <div className="border border-[#151515] bg-[#070707] p-5 rounded">
                <div className="flex items-center justify-between mb-4 border-b border-[#151515] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                    <span className="text-[10px] font-mono text-[#737373] uppercase font-bold tracking-widest">
                      5-Second CEO Health Radar (Prinsip 5 Detik)
                    </span>
                  </div>
                  <span className="text-[8px] font-mono text-[#D46B4A] uppercase tracking-wider">Status: Optimal</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#151515]/60 rounded">
                    <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] flex-shrink-0"></span>
                    <div>
                      <span className="text-[8px] font-mono text-[#737373] block uppercase">CASH RUNWAY</span>
                      <span className="text-xs font-mono text-white font-bold">{cashRunwayMonths} Bulan</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#151515]/60 rounded">
                    <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] flex-shrink-0"></span>
                    <div>
                      <span className="text-[8px] font-mono text-[#737373] block uppercase">CAC EFFICENCY</span>
                      <span className="text-xs font-mono text-white font-bold">Rasio 1:{ltvCacRatioVal}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#151515]/60 rounded">
                    <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] flex-shrink-0"></span>
                    <div>
                      <span className="text-[8px] font-mono text-[#737373] block uppercase">RETENTION RATE</span>
                      <span className="text-xs font-mono text-white font-bold">92% (Target 95%)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#151515]/60 rounded">
                    <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse flex-shrink-0"></span>
                    <div>
                      <span className="text-[8px] font-mono text-[#737373] block uppercase">PROJECT RISKS</span>
                      <span className="text-xs font-mono text-white font-bold">1 At Risk (PT Maju)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CORE FINANCIAL METRICS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="border border-[#151515] p-5 bg-[#070707] rounded hover:border-[#D46B4A]/40 transition-colors">
                  <span className="text-[9px] font-mono text-[#737373] uppercase tracking-wider block font-bold">REVENUE (MRR)</span>
                  <span className="text-lg font-mono text-[#FAFAFA] block mt-2">Rp 125.000.000</span>
                  <span className="text-[8px] font-mono text-green-500 block mt-1">🟢 Stable</span>
                </div>
                <div className="border border-[#151515] p-5 bg-[#070707] rounded hover:border-[#D46B4A]/40 transition-colors">
                  <span className="text-[9px] font-mono text-[#737373] uppercase tracking-wider block font-bold">CRM PIPELINE</span>
                  <span className="text-lg font-mono text-[#FAFAFA] block mt-2">Rp {pipelineValueTotal.toLocaleString('id-ID')}</span>
                  <span className="text-[8px] font-mono text-green-500 block mt-1">🟢 Growing</span>
                </div>
                <div className="border border-[#151515] p-5 bg-[#070707] rounded hover:border-[#D46B4A]/40 transition-colors">
                  <span className="text-[9px] font-mono text-[#737373] uppercase tracking-wider block font-bold">EXPENSES</span>
                  <span className="text-lg font-mono text-[#D46B4A] block mt-2">Rp {expenses.toLocaleString('id-ID')}</span>
                  <span className="text-[8px] font-mono text-[#737373] block mt-1">Total Ledger Cost</span>
                </div>
                <div className="border border-[#151515] p-5 bg-[#070707] rounded hover:border-[#D46B4A]/40 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-[#737373] uppercase tracking-wider block font-bold">CAC (COST)</span>
                    <span className="text-[7px] font-mono bg-[#111] text-[#737373] px-1 border border-[#222]">LTV:CAC 1:{ltvCacRatioVal}</span>
                  </div>
                  <span className="text-lg font-mono text-[#FAFAFA] block mt-2">Rp {calculatedCacVal.toLocaleString('id-ID')}</span>
                  <span className="text-[8px] font-mono text-green-500 block mt-1">🟢 Efficient</span>
                </div>
                <div className="border border-[#151515] p-5 bg-[#070707] rounded hover:border-[#D46B4A]/40 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-[#737373] uppercase tracking-wider block font-bold">RUNWAY</span>
                    <span className="text-[7px] font-mono bg-[#111] text-[#737373] px-1 border border-[#222]">Kas: Rp {currentTotalCash.toLocaleString('id-ID')}</span>
                  </div>
                  <span className="text-lg font-mono text-[#FAFAFA] block mt-2">{cashRunwayMonths} Bulan</span>
                  <span className="text-[8px] font-mono text-green-500 block mt-1">🟢 Healthy (&gt;12m)</span>
                </div>
                <div className="border border-[#151515] p-5 bg-[#070707] rounded hover:border-[#D46B4A]/40 transition-colors">
                  <span className="text-[9px] font-mono text-[#737373] uppercase tracking-wider block font-bold">RETENTION</span>
                  <span className="text-lg font-mono text-[#FAFAFA] block mt-2">92%</span>
                  <span className="text-[8px] font-mono text-yellow-500 block mt-1">🟡 Warn (Target 95%)</span>
                </div>
              </div>

              {/* BI INTEGRATION CENTER */}
              <div className="border border-[#151515] bg-[#070707] p-6 rounded">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#151515] pb-4 mb-6">
                  <div>
                    <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">BI // BUSINESS INTELLIGENCE SYSTEMS</span>
                    <h4 className="text-xl font-clash text-white">Pusat Integrasi Analitik Live</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 bg-[#0a0a0a] p-1 border border-[#151515] rounded">
                    <button
                      onClick={() => setSelectedBiPlatform('looker')}
                      className={`text-[8px] font-mono uppercase px-3 py-1.5 transition-colors font-bold rounded ${selectedBiPlatform === 'looker' ? 'bg-[#D46B4A] text-white' : 'text-[#737373] hover:text-white'}`}
                    >
                      Looker Studio
                    </button>
                    <button
                      onClick={() => setSelectedBiPlatform('powerbi')}
                      className={`text-[8px] font-mono uppercase px-3 py-1.5 transition-colors font-bold rounded ${selectedBiPlatform === 'powerbi' ? 'bg-[#D46B4A] text-white' : 'text-[#737373] hover:text-white'}`}
                    >
                      Power BI
                    </button>
                    <button
                      onClick={() => setSelectedBiPlatform('tableau')}
                      className={`text-[8px] font-mono uppercase px-3 py-1.5 transition-colors font-bold rounded ${selectedBiPlatform === 'tableau' ? 'bg-[#D46B4A] text-white' : 'text-[#737373] hover:text-white'}`}
                    >
                      Tableau
                    </button>
                  </div>
                </div>

                {/* BI Live Simulator View */}
                <div className="bg-[#050505] border border-[#151515] p-5 min-h-[300px] flex flex-col justify-between rounded relative overflow-hidden">
                  {isSyncingBi && (
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-50 flex flex-col justify-center items-center font-mono text-[10px] text-white gap-2">
                      <span className="animate-spin text-lg text-[#D46B4A]">⏳</span>
                      <span className="uppercase tracking-widest text-[#D46B4A] font-bold">Synchronizing Live Data Source API...</span>
                      <span className="text-[#555] text-[8px]">Connecting to PostgreSQL production replica & CRM endpoints</span>
                    </div>
                  )}

                  {/* Tab 1: Looker Studio - Marketing Funnel & Acquisition */}
                  {selectedBiPlatform === 'looker' && (
                    <div className="flex flex-col gap-5">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-white font-bold">📊 MARKETING FUNNEL & CONVERSION PIPELINE</span>
                        <span className="text-[#737373]">Live Source: Google Analytics + CRM</span>
                      </div>
                      <div className="flex flex-col gap-4 font-mono text-[9px]">
                        <div>
                          <div className="flex justify-between text-[#737373] mb-1">
                            <span>1. IMPRESSIONS (AWARENESS)</span>
                            <span className="text-white font-bold">14.820 Views</span>
                          </div>
                          <div className="h-4 bg-[#0a0a0a] border border-[#151515] w-full relative">
                            <div className="h-full bg-[#D46B4A]/25 border-r border-[#D46B4A]" style={{ width: '100%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[#737373] mb-1">
                            <span>2. CLICKS (INTEREST - CTR 5.2%)</span>
                            <span className="text-white font-bold">770 Clicks</span>
                          </div>
                          <div className="h-4 bg-[#0a0a0a] border border-[#151515] w-full relative">
                            <div className="h-full bg-[#D46B4A]/40 border-r border-[#D46B4A]" style={{ width: '60%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[#737373] mb-1">
                            <span>3. LEADS (INTENT)</span>
                            <span className="text-white font-bold">{leads.length} Active Leads</span>
                          </div>
                          <div className="h-4 bg-[#0a0a0a] border border-[#151515] w-full relative">
                            <div className="h-full bg-[#D46B4A]/60 border-r border-[#D46B4A]" style={{ width: '35%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[#737373] mb-1">
                            <span>4. CLIENTS (CLOSED DEAL - CONVERSION: 25.0%)</span>
                            <span className="text-white font-bold">{projects.length} Accounts</span>
                          </div>
                          <div className="h-4 bg-[#0a0a0a] border border-[#151515] w-full relative">
                            <div className="h-full bg-[#D46B4A] border-r border-[#ff8e66]" style={{ width: '25%' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-[9px] pt-2 border-t border-[#151515]">
                        <div className="p-2 bg-[#090909] border border-[#151515] rounded">
                          <span className="text-[#737373] block text-[8px]">AVG CPA</span>
                          <span className="text-white font-bold">Rp {(calculatedCacVal * 0.8).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="p-2 bg-[#090909] border border-[#151515] rounded">
                          <span className="text-[#737373] block text-[8px]">ORGANIC VISITORS</span>
                          <span className="text-white font-bold">4.120 /mo</span>
                        </div>
                        <div className="p-2 bg-[#090909] border border-[#151515] rounded">
                          <span className="text-[#737373] block text-[8px]">AD SPEND MRR</span>
                          <span className="text-white font-bold">Rp 8.500.000</span>
                        </div>
                        <div className="p-2 bg-[#090909] border border-[#151515] rounded">
                          <span className="text-[#737373] block text-[8px]">ROAS</span>
                          <span className="text-green-400 font-bold">4.8x</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Power BI - Ledger Financial Balance Matrix */}
                  {selectedBiPlatform === 'powerbi' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-white font-bold">⚡ GENERAL LEDGER COMPARATIVE BAR CHART</span>
                        <span className="text-[#737373]">Live Source: Ledger SQL Database</span>
                      </div>
                      
                      {/* Simulated Chart */}
                      <div className="flex h-36 items-end gap-5 border-b border-[#151515] px-4 font-mono text-[8px] text-[#737373] pb-1">
                        <div className="flex flex-col items-center flex-1">
                          <div className="text-white mb-1 font-bold">Rp {totalIncome.toLocaleString('id-ID')}</div>
                          <div className="w-full bg-green-500/20 border-t-2 border-green-500 h-28"></div>
                          <span className="mt-1.5 uppercase font-bold text-green-400">Total Income</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                          <div className="text-[#D46B4A] mb-1 font-bold">Rp {expenses.toLocaleString('id-ID')}</div>
                          <div className="w-full bg-[#D46B4A]/20 border-t-2 border-[#D46B4A] h-12"></div>
                          <span className="mt-1.5 uppercase font-bold text-[#D46B4A]">Total Expense</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                          <div className="text-white mb-1 font-bold">Rp {(totalIncome - expenses).toLocaleString('id-ID')}</div>
                          <div className="w-full bg-blue-500/20 border-t-2 border-blue-500 h-16"></div>
                          <span className="mt-1.5 uppercase font-bold text-blue-400">Net Flow</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 font-mono text-[9px] pt-1">
                        <div className="p-2.5 bg-[#090909] border border-[#151515] rounded">
                          <span className="text-[#737373] block text-[8px] uppercase">Margin Laba Bersih</span>
                          <span className="text-white font-bold text-sm">
                            {totalIncome > 0 ? (((totalIncome - expenses) / totalIncome) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                        <div className="p-2.5 bg-[#090909] border border-[#151515] rounded">
                          <span className="text-[#737373] block text-[8px] uppercase">Rasio Likuiditas</span>
                          <span className="text-green-400 font-bold text-sm">11.8x</span>
                        </div>
                        <div className="p-2.5 bg-[#090909] border border-[#151515] rounded">
                          <span className="text-[#737373] block text-[8px] uppercase">Rasio ROI Operasional</span>
                          <span className="text-white font-bold text-sm">{ltvCacRatioVal}x LTV/CAC</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Tableau - Client Geographic Mapping */}
                  {selectedBiPlatform === 'tableau' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-white font-bold">🗺️ CLIENT GEOGRAPHIC & SECTOR RADAR MAP</span>
                        <span className="text-[#737373]">Live Source: Client CRM Metadata</span>
                      </div>
                      
                      {/* SVG Canvas Map Simulation */}
                      <div className="border border-[#151515] bg-[#0a0a0a] rounded h-32 relative overflow-hidden flex items-center justify-center">
                        {/* Mock Map Shapes */}
                        <svg className="w-full h-full opacity-35" viewBox="0 0 500 200">
                          <path d="M 50,100 Q 120,40 200,90 T 350,80 T 450,110" fill="none" stroke="#222" strokeWidth="3" strokeDasharray="5,5" />
                          <circle cx="100" cy="80" r="15" fill="#111" stroke="#222" strokeWidth="1" />
                          <circle cx="280" cy="110" r="25" fill="#111" stroke="#222" strokeWidth="1" />
                          <circle cx="390" cy="60" r="18" fill="#111" stroke="#222" strokeWidth="1" />
                        </svg>

                        {/* Interactive Glowing Pointers */}
                        {/* Pointer 1: Jakarta */}
                        <div className="absolute top-[25%] left-[20%] group cursor-pointer flex flex-col items-center">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D46B4A] shadow-[0_0_12px_#D46B4A] animate-pulse"></span>
                          <span className="absolute top-3 font-mono text-[7px] text-white bg-black/80 px-1 border border-[#151515] hidden group-hover:block whitespace-nowrap z-50 font-bold uppercase tracking-wider text-[6px]">
                            Jakarta: 2 Proyek (Rp 500jt)
                          </span>
                          <span className="font-mono text-[6px] text-[#737373] mt-1.5">Jakarta</span>
                        </div>

                        {/* Pointer 2: Bali (Denpasar) */}
                        <div className="absolute top-[65%] left-[50%] group cursor-pointer flex flex-col items-center">
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_#22c55e] animate-pulse"></span>
                          <span className="absolute top-3 font-mono text-[7px] text-white bg-black/80 px-1 border border-[#151515] hidden group-hover:block whitespace-nowrap z-50 font-bold uppercase tracking-wider text-[6px]">
                            Bali HQ: 4 Proyek (Rp 575jt)
                          </span>
                          <span className="font-mono text-[6px] text-green-400 mt-1.5 font-bold">Bali HQ</span>
                        </div>

                        {/* Pointer 3: Surabaya */}
                        <div className="absolute top-[45%] left-[38%] group cursor-pointer flex flex-col items-center">
                          <span className="w-2 h-2 rounded-full bg-[#D46B4A] shadow-[0_0_8px_#D46B4A] animate-pulse"></span>
                          <span className="absolute top-3 font-mono text-[7px] text-white bg-black/80 px-1 border border-[#151515] hidden group-hover:block whitespace-nowrap z-50 font-bold uppercase tracking-wider text-[6px]">
                            Surabaya: 1 Proyek (Rp 75jt)
                          </span>
                          <span className="font-mono text-[6px] text-[#737373] mt-1.5">Surabaya</span>
                        </div>

                        {/* Pointer 4: Singapore */}
                        <div className="absolute top-[15%] left-[78%] group cursor-pointer flex flex-col items-center">
                          <span className="w-2 h-2 rounded-full bg-[#D46B4A] shadow-[0_0_8px_#D46B4A] animate-pulse"></span>
                          <span className="absolute top-3 font-mono text-[7px] text-white bg-black/80 px-1 border border-[#151515] hidden group-hover:block whitespace-nowrap z-50 font-bold uppercase tracking-wider text-[6px]">
                            Singapore: Pipeline (Rp 250jt)
                          </span>
                          <span className="font-mono text-[6px] text-[#737373] mt-1.5">Singapore</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center font-mono text-[8px] text-[#737373]">
                        <span>* Hover kota/wilayah untuk rincian data omset regional.</span>
                        <span className="text-green-500 font-bold">🟢 Regional Source Sync: OK</span>
                      </div>
                    </div>
                  )}

                  {/* BI Toolbar Footer */}
                  <div className="flex justify-between items-center border-t border-[#151515] pt-3 mt-4">
                    <span className="text-[8px] font-mono text-[#555] uppercase">
                      API Gateway Status: <span className="text-green-500 font-bold">CONNECTED</span> // SSL Secured
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsSyncingBi(true);
                          setTimeout(() => {
                            setIsSyncingBi(false);
                            triggerAlert('BI Dashboard Live Sync Complete!');
                          }, 1200);
                        }}
                        className="text-[8px] font-mono border border-[#151515] hover:border-[#D46B4A] hover:text-[#D46B4A] text-white px-2 py-1 uppercase rounded transition-colors"
                      >
                        🔄 Sync Live Data
                      </button>
                      <button
                        onClick={() => {
                          triggerAlert('Report Exported successfully to CEO Downloads folder.');
                        }}
                        className="text-[8px] font-mono bg-[#D46B4A] hover:bg-[#b0583b] text-white px-2 py-1 uppercase rounded transition-colors"
                      >
                        📥 Export Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members List */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono text-[#737373] uppercase font-bold tracking-widest">Team Capacity & Allocation</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team.map(member => (
                    <div key={member.id} className="border border-[#151515] bg-[#070707] p-4 flex justify-between items-center rounded">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-clash text-white text-sm">{member.name}</h4>
                          <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded border ${member.status === 'Available' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{member.status}</span>
                        </div>
                        <span className="text-[9px] text-[#737373] font-mono">{member.role} // Allocation: {member.utilization}%</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTeam(member)}
                          className="text-[8px] font-mono border border-[#151515] hover:border-[#D46B4A] text-white px-2.5 py-1 uppercase"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(member.id)}
                          className="text-[8px] font-mono border border-[#151515] hover:border-red-500/40 text-red-400 px-2.5 py-1 uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-[#151515] p-6 bg-[#070707] rounded">
                <span className="text-[10px] font-mono text-[#737373] uppercase font-bold tracking-widest block mb-4">Core Operating Doctrines</span>
                <ul className="flex flex-col gap-3 font-mono text-[10px] text-[#737373]">
                  <li>▪ 98% Automation Rate target for administrative pipelines.</li>
                  <li>▪ High-fidelity 3D modeling and custom physical enclosures.</li>
                  <li>▪ Direct-to-CTO external technical retainer scaling.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'ceo_crm' && (
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">CEO // RELATIONSHIPS</span>
                  <h3 className="text-3xl font-syne font-extrabold tracking-tight text-[#FAFAFA]">CRM & Pipeline</h3>
                </div>
                <button
                  onClick={() => {
                    setIsAddingLead(true);
                    setEditingLeadId(null);
                    setLeadForm({ clientName: '', contact: '', email: '', brief: '', value: 0, status: 'Draft' });
                  }}
                  className="bg-[#D46B4A] hover:bg-[#c25a3a] text-white font-mono text-[9px] font-bold px-3 py-1.5 uppercase rounded"
                >
                  + Add Lead
                </button>
              </div>

              {isAddingLead && (
                <div className="border border-[#151515] p-5 bg-[#070707] rounded max-w-md">
                  <form onSubmit={handleSaveLead} className="flex flex-col gap-3 font-mono text-[9px]">
                    <span className="text-[#D46B4A] font-bold uppercase">{editingLeadId ? 'Edit Lead' : 'Register New Lead'}</span>
                    <input
                      type="text"
                      placeholder="Client/Company Name"
                      value={leadForm.clientName}
                      onChange={(e) => setLeadForm({ ...leadForm, clientName: e.target.value })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Contact Person"
                      value={leadForm.contact}
                      onChange={(e) => setLeadForm({ ...leadForm, contact: e.target.value })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Client Email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <textarea
                      placeholder="Brief description"
                      value={leadForm.brief}
                      onChange={(e) => setLeadForm({ ...leadForm, brief: e.target.value })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white h-16 resize-none"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Value (Rp)"
                      value={leadForm.value || ''}
                      onChange={(e) => setLeadForm({ ...leadForm, value: Number(e.target.value) })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <select
                      value={leadForm.status}
                      onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
                      className="bg-[#050505] border border-[#151515] outline-none p-2 text-white"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Pitching">Pitching</option>
                      <option value="Negosiasi Harga">Negosiasi Harga</option>
                      <option value="Closing">Closing</option>
                      <option value="Lost">Lost</option>
                    </select>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-[#D46B4A] text-white px-4 py-2 font-bold uppercase rounded">Save</button>
                      <button type="button" onClick={() => setIsAddingLead(false)} className="border border-[#151515] text-[#737373] px-4 py-2 font-bold uppercase rounded">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-3">
                  {leads.map(lead => (
                    <div key={lead.id} className="border border-[#151515] bg-[#070707] p-5 flex justify-between items-center hover:border-[#D46B4A] transition-all duration-300 rounded">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-clash text-[#FAFAFA] text-base">{lead.clientName}</h4>
                          <span className={`font-mono text-[8px] px-2 py-0.5 rounded border border-[#151515] uppercase font-bold ${lead.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-[#111] text-[#FAFAFA]'}`}>{lead.status}</span>
                        </div>
                        <p className="text-[#737373] text-[11px] mt-1">{lead.brief}</p>
                        <span className="font-mono text-[8px] text-[#737373] mt-2 block">CONTACT: {lead.contact} // {lead.email}</span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-mono text-sm">Rp {lead.value.toLocaleString('id-ID')}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startAiPitch(lead)}
                            className="bg-[#050505] border border-[#D46B4A]/30 hover:border-[#D46B4A] text-[#D46B4A] font-mono text-[8px] uppercase tracking-wider px-2 py-1 rounded"
                          >
                            Pitch AI
                          </button>
                          <button
                            onClick={() => handleEditLead(lead)}
                            className="bg-transparent border border-[#151515] hover:border-[#D46B4A] text-white font-mono text-[8px] uppercase px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="bg-transparent border border-[#151515] hover:border-red-500/40 text-red-400 font-mono text-[8px] uppercase px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1 border border-[#151515] bg-[#050505] p-5 flex flex-col justify-between min-h-[300px] rounded relative">
                  <span className="text-[9px] font-mono text-[#D46B4A] uppercase tracking-widest font-bold block mb-3">AI Outreach Generator</span>
                  {activePitchLead ? (
                    <p className="text-[#FAFAFA] font-mono text-[9px] leading-relaxed whitespace-pre-wrap max-h-[220px] overflow-y-auto">
                      {pitchText}
                      {isTyping && <span className="inline-block w-1 h-3 bg-[#D46B4A] ml-0.5 animate-pulse"></span>}
                    </p>
                  ) : (
                    <p className="text-[#737373] font-mono text-[9px] italic text-center mt-20">Click 'Pitch AI' next to a lead.</p>
                  )}
                  {activePitchLead && !isTyping && (
                    <button
                      onClick={() => { navigator.clipboard.writeText(pitchText); triggerAlert('Copied to clipboard'); }}
                      className="w-full py-2 bg-[#D46B4A] text-white font-mono text-[8px] uppercase font-bold tracking-wider rounded"
                    >
                      Copy Pitch Code
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'ceo_projects' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">CEO // PROJECTS</span>
                  <h3 className="text-3xl font-syne font-extrabold tracking-tight text-[#FAFAFA]">Project Oversight</h3>
                </div>
                <button
                  onClick={() => {
                    setIsAddingProject(true);
                    setEditingProjectId(null);
                    setProjectForm({ name: '', client: '', progress: 0, phase: 'Design', budget: 0, profit: 0, riskScore: 'Low', status: 'Draft' });
                  }}
                  className="bg-[#D46B4A] hover:bg-[#c25a3a] text-white font-mono text-[9px] font-bold px-3 py-1.5 uppercase rounded"
                >
                  + Add Project
                </button>
              </div>

              {isAddingProject && (
                <div className="border border-[#151515] p-5 bg-[#070707] rounded max-w-md">
                  <form onSubmit={handleSaveProject} className="flex flex-col gap-3 font-mono text-[9px]">
                    <span className="text-[#D46B4A] font-bold uppercase">{editingProjectId ? 'Edit Project' : 'Register New Project'}</span>
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Client Name"
                      value={projectForm.client}
                      onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Progress (%)"
                      value={projectForm.progress}
                      onChange={(e) => setProjectForm({ ...projectForm, progress: Number(e.target.value) })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                      min="0"
                      max="100"
                    />
                    <select
                      value={projectForm.phase}
                      onChange={(e) => setProjectForm({ ...projectForm, phase: e.target.value })}
                      className="bg-[#050505] border border-[#151515] outline-none p-2 text-white"
                    >
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Testing & QA">Testing & QA</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Budget (Rp)"
                      value={projectForm.budget || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, budget: Number(e.target.value) })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Estimated Profit (Rp)"
                      value={projectForm.profit || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, profit: Number(e.target.value) })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <select
                      value={projectForm.riskScore}
                      onChange={(e) => setProjectForm({ ...projectForm, riskScore: e.target.value })}
                      className="bg-[#050505] border border-[#151515] outline-none p-2 text-white"
                    >
                      <option value="Low">Low Risk</option>
                      <option value="Medium">Medium Risk</option>
                      <option value="High">High Risk</option>
                    </select>
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                      className="bg-[#050505] border border-[#151515] outline-none p-2 text-white"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                      <option value="At Risk">At Risk</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-[#D46B4A] text-white px-4 py-2 font-bold uppercase rounded">Save</button>
                      <button type="button" onClick={() => setIsAddingProject(false)} className="border border-[#151515] text-[#737373] px-4 py-2 font-bold uppercase rounded">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {projects.map(p => (
                  <div key={p.id} className="border border-[#151515] bg-[#070707] p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-clash text-[#FAFAFA] text-base">{p.name}</h4>
                        <span className={`text-[7px] font-mono font-bold px-1.5 py-0.5 rounded border ${p.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : (p.status === 'At Risk' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20')}`}>{p.status}</span>
                        <span className="text-[8px] font-mono text-[#737373]">PHASE: {p.phase}</span>
                      </div>
                      <span className="font-mono text-[8px] text-[#737373] mt-2 block">BUDGET: Rp {p.budget.toLocaleString('id-ID')} // PROFIT: Rp {p.profit.toLocaleString('id-ID')} // RISK: {p.riskScore}</span>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="font-mono text-[9px] text-[#FAFAFA]">PROGRESS: <strong>{p.progress}%</strong></span>
                        <div className="w-24 bg-[#111] h-1 rounded overflow-hidden">
                          <div className="h-full bg-[#D46B4A]" style={{ width: `${p.progress}%` }}></div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProject(p)}
                          className="text-[8px] font-mono border border-[#151515] hover:border-[#D46B4A] text-white px-2 py-1 uppercase rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="text-[8px] font-mono border border-[#151515] hover:border-red-500/40 text-red-400 px-2 py-1 uppercase rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'ceo_publish' && (
            <div className="flex flex-col gap-8">
              <div>
                <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">CEO // PUBLISH CENTER</span>
                <h3 className="text-3xl font-syne font-extrabold tracking-tight text-[#FAFAFA]">Publish Portal Update</h3>
              </div>

              <div className="max-w-md border border-[#151515] bg-[#070707] p-6 rounded">
                <form onSubmit={handlePublishUpdate} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 font-mono text-[9px]">
                    <label className="text-[#737373] font-bold">CHOOSE PROJECT TARGET</label>
                    <select
                      value={publishTargetProject}
                      onChange={(e) => setPublishTargetProject(e.target.value)}
                      className="bg-[#050505] border border-[#151515] text-[#FAFAFA] p-2 outline-none"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 font-mono text-[9px]">
                    <label className="text-[#737373] font-bold">TYPE VERSION UPDATE MESSAGE</label>
                    <textarea
                      value={publishMessage}
                      onChange={(e) => setPublishMessage(e.target.value)}
                      placeholder="e.g. Backend finished, waiting for UI approvals."
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-[#FAFAFA] h-24 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#D46B4A] text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded"
                  >
                    Publish to Client Portal
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeSubTab === 'ceo_transparency' && (
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-center border-b border-[#151515] pb-2">
                <div>
                  <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">CEO // TRANSACTIONS & TRANSPARENCY</span>
                  <h3 className="text-3xl font-syne font-extrabold tracking-tight text-[#FAFAFA]">Commit Feed & Ledger</h3>
                </div>
                <button
                  onClick={() => {
                    setIsAddingTransaction(true);
                    setEditingTransactionId(null);
                    setTransactionForm({ type: 'Income', category: '', description: '', amount: 0, date: new Date().toISOString().split('T')[0] });
                  }}
                  className="bg-[#D46B4A] hover:bg-[#c25a3a] text-white font-mono text-[9px] font-bold px-3 py-1.5 uppercase rounded"
                >
                  + Record Transaction
                </button>
              </div>

              {isAddingTransaction && (
                <div className="border border-[#151515] p-5 bg-[#070707] rounded max-w-md">
                  <form onSubmit={handleSaveTransaction} className="flex flex-col gap-3 font-mono text-[9px]">
                    <span className="text-[#D46B4A] font-bold uppercase">{editingTransactionId ? 'Edit Transaction' : 'Record New Transaction'}</span>
                    <select
                      value={transactionForm.type}
                      onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}
                      className="bg-[#050505] border border-[#151515] outline-none p-2 text-white"
                    >
                      <option value="Income">Income (+)</option>
                      <option value="Expense">Expense (-)</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Category (e.g. Infrastructure, Project Invoice)"
                      value={transactionForm.category}
                      onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={transactionForm.description}
                      onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Amount (Rp)"
                      value={transactionForm.amount || ''}
                      onChange={(e) => setTransactionForm({ ...transactionForm, amount: Number(e.target.value) })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <input
                      type="date"
                      value={transactionForm.date}
                      onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                      className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      required
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-[#D46B4A] text-white px-4 py-2 font-bold uppercase rounded">Save</button>
                      <button type="button" onClick={() => setIsAddingTransaction(false)} className="border border-[#151515] text-[#737373] px-4 py-2 font-bold uppercase rounded">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Transactions Table Ledger */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono text-[#737373] uppercase font-bold tracking-widest">Financial Ledger</span>
                <div className="flex flex-col gap-2">
                  {transactions.map(trx => (
                    <div key={trx.id} className="border border-[#151515] bg-[#070707] p-4 flex justify-between items-center rounded">
                      <div className="flex items-center gap-4">
                        <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border ${trx.type === 'Income' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {trx.type === 'Income' ? '+' : '-'} {trx.category}
                        </span>
                        <div>
                          <span className="text-white text-xs font-mono block">{trx.description}</span>
                          <span className="text-[#737373] text-[8px] font-mono">{trx.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-mono text-sm ${trx.type === 'Income' ? 'text-green-400' : 'text-red-400'}`}>Rp {trx.amount.toLocaleString('id-ID')}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTransaction(trx)}
                            className="text-[8px] font-mono border border-[#151515] hover:border-[#D46B4A] text-white px-2 py-1 uppercase rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(trx.id)}
                            className="text-[8px] font-mono border border-[#151515] hover:border-red-500/40 text-red-400 px-2 py-1 uppercase rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commit Feed */}
              <div className="flex flex-col gap-3 pt-4 border-t border-[#151515]">
                <span className="text-[10px] font-mono text-[#737373] uppercase font-bold tracking-widest">Commit Feed</span>
                <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto">
                  {transparencyLog.map((log, i) => (
                    <div key={i} className="flex items-center gap-3 font-mono text-[9px] text-[#737373] border-b border-[#151515] pb-2">
                      <span className="text-[#D46B4A] font-bold">[{log.time}]</span>
                      <span>{log.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'ai_brain' && (
            <div className="flex flex-col gap-6 min-h-[420px] justify-between">
              {/* ... AI Brain conversational terminal code unchanged ... */}
              <div>
                <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">AI BRAIN // AGENT GPT</span>
                <h3 className="text-3xl font-syne font-extrabold tracking-tight text-[#FAFAFA]">Conversational Terminal</h3>
              </div>

              <div className="border border-[#151515] bg-[#050505] p-5 flex flex-col justify-between h-[340px] rounded relative max-w-xl">
                <div className="overflow-y-auto flex flex-col gap-3 font-mono text-[9px] pr-2 max-h-[280px]">
                  {aiFeed.map((chat, i) => (
                    <div key={i} className={`flex flex-col gap-1 ${chat.sender === 'User' ? 'items-end' : 'items-start'}`}>
                      <span className="text-[6px] text-[#737373] uppercase font-bold">{chat.sender}</span>
                      <span className={`py-1.5 px-3 rounded text-[9px] max-w-[85%] whitespace-pre-wrap ${chat.sender === 'User' ? 'bg-[#D46B4A] text-white' : 'bg-[#0E0E0E] text-[#FAFAFA] border border-[#151515]'}`}>
                        {chat.text}
                      </span>
                    </div>
                  ))}
                  {isAiThinking && (
                    <div className="text-[8px] font-mono text-[#D46B4A] animate-pulse">AI Brain compiling response...</div>
                  )}
                </div>

                <form
                  onSubmit={(e) => { e.preventDefault(); askAiBrain(aiInput); }}
                  className="border-t border-[#151515] pt-4 mt-4 flex gap-2"
                >
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Type queries or click blueprints..."
                    className="flex-grow bg-transparent border-b border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-xs font-mono text-[#FAFAFA]"
                  />
                  <button
                    type="submit"
                    className="bg-[#D46B4A] text-white font-mono text-[9px] font-bold uppercase px-4 rounded"
                  >
                    SUBMIT
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeSubTab === 'ai_blueprints' && (
            <div className="flex flex-col gap-6">
              {/* ... AI Blueprints code unchanged ... */}
              <div>
                <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">AI BRAIN // BLUEPRINTS</span>
                <h3 className="text-3xl font-syne font-extrabold tracking-tight text-[#FAFAFA]">Preset Queries</h3>
              </div>

              <div className="flex flex-col gap-2 max-w-md font-mono text-[9px]">
                <button
                  onClick={() => askAiBrain("Which project is at risk?")}
                  className="w-full text-left p-3 border border-[#151515] hover:border-[#D46B4A] hover:bg-[#D46B4A]/5 text-[#FAFAFA] uppercase"
                >
                  ▪ Risk Auditor: "Which project is at risk?"
                </button>
                <button
                  onClick={() => askAiBrain("When will my website launch?")}
                  className="w-full text-left p-3 border border-[#151515] hover:border-[#D46B4A] hover:bg-[#D46B4A]/5 text-[#FAFAFA] uppercase"
                >
                  ▪ Client: "When will my website launch?"
                </button>
                <button
                  onClick={() => askAiBrain("Generate proposal for lead Maju")}
                  className="w-full text-left p-3 border border-[#151515] hover:border-[#D46B4A] hover:bg-[#D46B4A]/5 text-[#FAFAFA] uppercase"
                >
                  ▪ CEO: "Generate proposal"
                </button>
                <button
                  onClick={() => askAiBrain("Explain backend database API")}
                  className="w-full text-left p-3 border border-[#151515] hover:border-[#D46B4A] hover:bg-[#D46B4A]/5 text-[#FAFAFA] uppercase"
                >
                  ▪ Dev: "Explain this API schema"
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'ceo_web_manager' && (
            <div className="flex flex-col gap-8">
              <div>
                <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">CEO // WEB CONTENT MANAGER</span>
                <h3 className="text-3xl font-syne font-extrabold tracking-tight text-[#FAFAFA]">Manage Public Landing Page</h3>
              </div>

              {/* Sub-sections: Works and Partnerships */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* PART 1: SELECTED WORKS / CASE STUDIES */}
                <div className="border border-[#151515] bg-[#070707] p-6 rounded flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-[#151515] pb-3">
                    <span className="text-[10px] font-mono text-[#FAFAFA] font-bold uppercase tracking-wider">📁 Selected Works & Case Studies ({publicWorks.length})</span>
                    <button
                      onClick={() => {
                        setIsAddingWork(true);
                        setEditingWorkId(null);
                        setWorkForm({ 
                          title: '', 
                          type: 'client',
                          tags: '', 
                          desc_id: '', 
                          desc_en: '', 
                          link: '', 
                          image: '',
                          problem_id: '',
                          problem_en: '',
                          solution_id: '',
                          solution_en: '',
                          result_id: '',
                          result_en: ''
                        });
                      }}
                      className="bg-[#D46B4A] hover:bg-[#c25a3a] text-white font-mono text-[8px] font-bold px-2.5 py-1 uppercase rounded"
                    >
                      + Add Work
                    </button>
                  </div>

                  {isAddingWork && (
                    <form onSubmit={handleSaveWork} className="flex flex-col gap-3 font-mono text-[9px] bg-[#0a0a0a] p-4 border border-[#151515] rounded">
                      <span className="text-[#D46B4A] font-bold uppercase">{editingWorkId ? 'Edit Selected Work' : 'Add New Selected Work'}</span>
                      <input
                        type="text"
                        placeholder="Project Title (e.g. Lensa Insignia)"
                        value={workForm.title}
                        onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
                        className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                        required
                      />
                      <select
                        value={workForm.type || 'client'}
                        onChange={(e) => setWorkForm({ ...workForm, type: e.target.value })}
                        className="bg-[#050505] border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-[#FAFAFA]"
                        required
                      >
                        <option value="client">Client Project / Proyek Aktif</option>
                        <option value="concept">Concept Blueprint / Studi Kasus Konsep</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Tags (comma-separated, e.g. AI, SaaS)"
                        value={workForm.tags}
                        onChange={(e) => setWorkForm({ ...workForm, tags: e.target.value })}
                        className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                        required
                      />
                      <textarea
                        placeholder="Description / Summary (Indonesian)"
                        value={workForm.desc_id}
                        onChange={(e) => setWorkForm({ ...workForm, desc_id: e.target.value })}
                        className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white h-12 resize-none"
                        required
                      />
                      <textarea
                        placeholder="Description / Summary (English)"
                        value={workForm.desc_en}
                        onChange={(e) => setWorkForm({ ...workForm, desc_en: e.target.value })}
                        className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white h-12 resize-none"
                        required
                      />
                      
                      {/* Case Study Details */}
                      <span className="text-[#737373] font-bold uppercase mt-1 border-t border-[#151515] pt-2">Case Study Details (Problem, Solution, Impact)</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <textarea
                          placeholder="Problem / Tantangan (Indonesian)"
                          value={workForm.problem_id}
                          onChange={(e) => setWorkForm({ ...workForm, problem_id: e.target.value })}
                          className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white h-12 resize-none"
                        />
                        <textarea
                          placeholder="Problem / Challenge (English)"
                          value={workForm.problem_en}
                          onChange={(e) => setWorkForm({ ...workForm, problem_en: e.target.value })}
                          className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white h-12 resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <textarea
                          placeholder="Solution / Solusi AI (Indonesian)"
                          value={workForm.solution_id}
                          onChange={(e) => setWorkForm({ ...workForm, solution_id: e.target.value })}
                          className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white h-12 resize-none"
                        />
                        <textarea
                          placeholder="Solution / AI Integration (English)"
                          value={workForm.solution_en}
                          onChange={(e) => setWorkForm({ ...workForm, solution_en: e.target.value })}
                          className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white h-12 resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <textarea
                          placeholder="Result / Dampak & ROI (Indonesian)"
                          value={workForm.result_id}
                          onChange={(e) => setWorkForm({ ...workForm, result_id: e.target.value })}
                          className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white h-12 resize-none"
                        />
                        <textarea
                          placeholder="Result / Business Impact & ROI (English)"
                          value={workForm.result_en}
                          onChange={(e) => setWorkForm({ ...workForm, result_en: e.target.value })}
                          className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white h-12 resize-none"
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Case Study Link (optional, e.g. https://...)"
                        value={workForm.link}
                        onChange={(e) => setWorkForm({ ...workForm, link: e.target.value })}
                        className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Image Path / URL (optional, e.g. /sapawarga_logo.jpg)"
                        value={workForm.image}
                        onChange={(e) => setWorkForm({ ...workForm, image: e.target.value })}
                        className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="bg-[#D46B4A] text-white px-3 py-1.5 font-bold uppercase rounded">Save Work</button>
                        <button type="button" onClick={() => setIsAddingWork(false)} className="border border-[#151515] text-[#737373] px-3 py-1.5 font-bold uppercase rounded">Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                    {publicWorks.map((work) => (
                      <div key={work.id} className="border border-[#151515] bg-[#0a0a0a] p-4 flex justify-between items-start rounded">
                        <div className="flex flex-col gap-1.5 max-w-[70%]">
                          <div className="flex items-center gap-2">
                            <span className="font-clash text-white text-sm font-bold">{work.title}</span>
                            <span className="text-[7px] font-mono bg-[#151515] border border-[#222] text-[#D46B4A] px-1.5 py-0.5 rounded">
                              {(work.tags || []).join(', ')}
                            </span>
                          </div>
                          <p className="text-[8px] text-[#737373] font-mono line-clamp-2">ID: {work.desc_id}</p>
                          <p className="text-[8px] text-[#555] font-mono line-clamp-2">EN: {work.desc_en}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEditWork(work)}
                            className="text-[8px] font-mono border border-[#151515] hover:border-[#D46B4A] text-white px-2 py-1 uppercase"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteWork(work.id)}
                            className="text-[8px] font-mono border border-[#151515] hover:border-red-500/40 text-red-400 px-2 py-1 uppercase"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PART 2: PARTNERSHIPS */}
                <div className="border border-[#151515] bg-[#070707] p-6 rounded flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-[#151515] pb-3">
                    <span className="text-[10px] font-mono text-[#FAFAFA] font-bold uppercase tracking-wider">🤝 Partnerships & Programs ({partnerships.length})</span>
                    <button
                      onClick={() => {
                        setIsAddingPartnership(true);
                        setEditingPartnershipId(null);
                        setPartnershipForm({ title_id: '', title_en: '', desc_id: '', desc_en: '' });
                      }}
                      className="bg-[#D46B4A] hover:bg-[#c25a3a] text-white font-mono text-[8px] font-bold px-2.5 py-1 uppercase rounded"
                    >
                      + Add Partnership
                    </button>
                  </div>

                  {isAddingPartnership && (
                    <form onSubmit={handleSavePartnership} className="flex flex-col gap-3 font-mono text-[9px] bg-[#0a0a0a] p-4 border border-[#151515] rounded">
                      <span className="text-[#D46B4A] font-bold uppercase">{editingPartnershipId ? 'Edit Partnership' : 'Add New Partnership'}</span>
                      <input
                        type="text"
                        placeholder="Title (Indonesian)"
                        value={partnershipForm.title_id}
                        onChange={(e) => setPartnershipForm({ ...partnershipForm, title_id: e.target.value })}
                        className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Title (English)"
                        value={partnershipForm.title_en}
                        onChange={(e) => setPartnershipForm({ ...partnershipForm, title_en: e.target.value })}
                        className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                        required
                      />
                      <textarea
                        placeholder="Description (Indonesian)"
                        value={partnershipForm.desc_id}
                        onChange={(e) => setPartnershipForm({ ...partnershipForm, desc_id: e.target.value })}
                        className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white h-16 resize-none"
                        required
                      />
                      <textarea
                        placeholder="Description (English)"
                        value={partnershipForm.desc_en}
                        onChange={(e) => setPartnershipForm({ ...partnershipForm, desc_en: e.target.value })}
                        className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white h-16 resize-none"
                        required
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="bg-[#D46B4A] text-white px-3 py-1.5 font-bold uppercase rounded">Save Program</button>
                        <button type="button" onClick={() => setIsAddingPartnership(false)} className="border border-[#151515] text-[#737373] px-3 py-1.5 font-bold uppercase rounded">Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                    {partnerships.map((partner) => (
                      <div key={partner.id} className="border border-[#151515] bg-[#0a0a0a] p-4 flex justify-between items-start rounded">
                        <div className="flex flex-col gap-1 max-w-[70%]">
                          <div className="font-clash text-white text-sm font-bold">
                            ID: {partner.title_id} / EN: {partner.title_en}
                          </div>
                          <p className="text-[8px] text-[#737373] font-mono line-clamp-2">ID: {partner.desc_id}</p>
                          <p className="text-[8px] text-[#555] font-mono line-clamp-2">EN: {partner.desc_en}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEditPartnership(partner)}
                            className="text-[8px] font-mono border border-[#151515] hover:border-[#D46B4A] text-white px-2.5 py-1 uppercase"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePartnership(partner.id)}
                            className="text-[8px] font-mono border border-[#151515] hover:border-red-500/40 text-red-400 px-2.5 py-1 uppercase"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#151515] flex items-center justify-between px-8 text-[9px] font-mono text-[#737373] uppercase tracking-wider shrink-0 bg-[#0D0D0D] h-12">
        <p>&copy; 2026 AGENCY COMMAND. NO OVERLAP. ALL ALIGNED.</p>
        <p>LATENCY: 12MS / SYSTEM STABLE</p>
      </footer>
    </div>
  );
};

export default AdminPortal;
