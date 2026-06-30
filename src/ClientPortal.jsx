import React, { useState } from 'react';

const ClientPortal = ({
  projects,
  setProjects,
  transparencyLog,
  setTransparencyLog,
  onBackHome
}) => {
  // Client authentication state
  const [clientProjectToken, setClientProjectToken] = useState('');
  const [activeClientProject, setActiveClientProject] = useState(null);

  // UI state
  const [alertMsg, setAlertMsg] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('client_dashboard');

  // --- FUNCTIONS ---

  const triggerAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 2500);
  };

  // Client Portal login by Project ID
  const handleClientRegister = (e) => {
    e.preventDefault();
    const validProj = projects.find(p => p.id === clientProjectToken.toUpperCase().trim());
    if (validProj) {
      setActiveClientProject(validProj);
      triggerAlert(`Welcome back, client of ${validProj.name}!`);
    } else {
      triggerAlert('Project ID not found / invalid token');
    }
  };

  // Client Milestones Approval
  const handleClientApprove = (milestoneKey) => {
    if (!activeClientProject) return;

    const timeString = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    setProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id === activeClientProject.id) {
          const updatedApprovals = {
            ...p.approvedMilestones,
            [milestoneKey]: true
          };
          return {
            ...p,
            approvedMilestones: updatedApprovals,
            progress: Math.min(p.progress + 5, 100),
            activityFeed: [
              { time: timeString, text: `Client approved deliverable: ${milestoneKey}` },
              ...p.activityFeed
            ]
          };
        }
        return p;
      })
    );

    setTransparencyLog(prev => [
      { time: timeString, text: `[CLIENT APPROVAL] Approved ${milestoneKey} on ${activeClientProject.name}` },
      ...prev
    ]);

    setActiveClientProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        approvedMilestones: {
          ...prev.approvedMilestones,
          [milestoneKey]: true
        },
        progress: Math.min(prev.progress + 5, 100)
      };
    });

    triggerAlert(`Milestone approved! Progress updated.`);
  };

  // Disconnect / Logout
  const handleDisconnect = () => {
    setActiveClientProject(null);
    setClientProjectToken('');
    onBackHome();
  };

  // Navigation items
  const navItems = [
    { id: 'client_dashboard', number: '01', label: 'Progress Board' },
    { id: 'client_timeline', number: '02', label: 'Activity Feed' },
    { id: 'client_approvals', number: '03', label: 'Approvals Hub' }
  ];

  // --- PRE-AUTH: Full-screen token input ---
  if (!activeClientProject) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-6 relative font-sans selection:bg-[#D46B4A] selection:text-white">
        
        {/* Back Home button */}
        <button
          onClick={onBackHome}
          className="absolute top-6 left-6 text-[#737373] hover:text-[#FAFAFA] font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          ← Home
        </button>

        {/* Alert Box */}
        {alertMsg && (
          <div className="fixed top-6 right-6 bg-[#0E0E0E] border border-[#D46B4A]/60 text-[#FAFAFA] font-mono text-[9px] uppercase font-bold tracking-widest py-3 px-5 z-[999] rounded">
            ⚡ {alertMsg}
          </div>
        )}

        <div className="w-full max-w-sm border border-[#151515] bg-[#070707] p-6 flex flex-col gap-5 rounded shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <div>
            <span className="text-[9px] font-mono text-[#D46B4A] uppercase tracking-widest font-bold block">CLIENT GATEWAY</span>
            <h4 className="text-xl font-clash text-[#FAFAFA] mt-1">Access Project Portal</h4>
          </div>

          <form onSubmit={handleClientRegister} className="flex flex-col gap-4 font-mono text-[10px]">
            <div className="flex flex-col gap-2">
              <label className="text-[#737373] uppercase font-bold">ENTER PROJECT ID TOKEN</label>
              <input
                type="text"
                placeholder="e.g. PRJ-URBAN"
                value={clientProjectToken}
                onChange={(e) => setClientProjectToken(e.target.value)}
                className="bg-[#050505] border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-[#FAFAFA] text-xs font-mono uppercase"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#D46B4A] text-white font-bold uppercase tracking-wider rounded"
            >
              Register & Connect
            </button>
          </form>

          <div className="border-t border-[#151515] pt-4 font-mono text-[8px] text-[#737373]">
            <span>ℹ️ Default project IDs for demo: <strong>PRJ-URBAN</strong>, <strong>PRJ-MAJU</strong>, <strong>PRJ-TECHNO</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // --- POST-AUTH: Full Dashboard Layout ---
  return (
    <div className="flex flex-col h-screen bg-[#0D0D0D] text-[#FAFAFA] overflow-hidden font-sans selection:bg-[#D46B4A] selection:text-white transition-colors duration-300">
      
      {/* Header */}
      <header className="border-b border-[#151515] flex items-center justify-between px-4 sm:px-8 h-[80px] shrink-0 z-20 bg-[#0D0D0D]">
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="font-maroni text-2xl sm:text-[38px] leading-none tracking-[-1px] m-0 p-0 text-[#FAFAFA] hover:text-[#D46B4A] transition-colors cursor-pointer select-none">
            Agency OS.
          </h1>
          <span className="text-[8px] font-mono text-[#D46B4A] border border-[#D46B4A]/20 px-2 py-0.5 rounded bg-[#D46B4A]/5 uppercase tracking-widest font-bold">V2.0</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden sm:inline text-[9px] font-mono text-[#D46B4A] uppercase tracking-widest font-bold">CLIENT PORTAL</span>
          <span className="text-[8px] sm:text-[9px] font-mono text-[#737373] uppercase tracking-wider truncate max-w-[80px] sm:max-w-none">// {activeClientProject.name}</span>
          <button
            onClick={handleDisconnect}
            className="text-[9px] uppercase font-bold tracking-widest text-[#737373] hover:text-[#FAFAFA] transition-colors border border-[#151515] hover:border-red-500/50 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded"
          >
            Disconnect
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden relative">

        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-[300px] border-b lg:border-b-0 lg:border-r border-[#151515] flex flex-row lg:flex-col p-4 lg:p-8 shrink-0 bg-[#0D0D0D] overflow-x-auto lg:overflow-y-auto no-scrollbar relative">
          <span className="hidden lg:block" style={{ writingMode: 'vertical-rl', position: 'absolute', right: '-10px', top: '100px', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.15, fontFamily: 'monospace' }}>
            CLIENT CONSOLE
          </span>
          <nav className="flex flex-row lg:flex-col gap-4 lg:gap-6 mt-0 lg:mt-4 w-full">
            {navItems.map(item => {
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  className={`flex flex-row lg:flex-col items-baseline lg:items-start text-left group border-b lg:border-b border-transparent lg:border-[#151515] pb-1 lg:pb-3 shrink-0 gap-2 lg:gap-0 ${isActive ? 'opacity-100 border-[#D46B4A]' : 'opacity-40 hover:opacity-100'} transition-all`}
                >
                  <span className="font-mono italic text-[10px] lg:text-xs opacity-50 block text-[#D46B4A]">{item.number}</span>
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

          {/* ========================================================================= */}
          {/* CLIENT SUBTABS */}
          <div>
            {activeSubTab === 'client_dashboard' && (
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center border-b border-[#151515] pb-4">
                  <div>
                    <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">CLIENT // PROGRESS</span>
                    <h3 className="text-3xl font-clash text-[#FAFAFA]">{activeClientProject.name}</h3>
                  </div>
                  
                  <button
                    onClick={() => { setActiveClientProject(null); setClientProjectToken(''); }}
                    className="border border-[#151515] text-[#FAFAFA] font-mono text-[9px] uppercase px-3 py-1.5 hover:border-[#D46B4A] rounded"
                  >
                    Disconnect Gateway
                  </button>
                </div>

                <div className="border border-[#151515] bg-[#070707] p-6 rounded flex flex-col gap-4 max-w-lg">
                  <span className="text-[9px] font-mono text-[#737373] uppercase tracking-widest font-bold">PROJECT COMPLETION STATE</span>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold text-[#D46B4A]">{activeClientProject.progress}%</span>
                    <div className="flex-grow bg-[#111] h-3 rounded overflow-hidden">
                      <div className="h-full bg-[#D46B4A] transition-all duration-500" style={{ width: `${activeClientProject.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'client_timeline' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">CLIENT // FEED</span>
                  <h3 className="text-3xl font-syne font-extrabold tracking-tight text-[#FAFAFA]">Operational Commit Feed</h3>
                </div>

                <div className="flex flex-col gap-3 max-w-xl">
                  {activeClientProject.activityFeed.map((feed, i) => (
                    <div key={i} className="flex items-center gap-3 font-mono text-[9px] border-b border-[#151515]/30 pb-2">
                      <span className="text-[#D46B4A] font-bold">[{feed.time}]</span>
                      <span className="text-[#FAFAFA]">{feed.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === 'client_approvals' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">CLIENT // APPROVALS</span>
                  <h3 className="text-3xl font-syne font-extrabold tracking-tight text-[#FAFAFA]">Milestones approvals</h3>
                </div>

                <div className="max-w-md border border-[#151515] bg-[#070707] p-5 flex flex-col gap-3 rounded">
                  <button
                    onClick={() => handleClientApprove('design')}
                    disabled={activeClientProject.approvedMilestones.design}
                    className={`w-full text-left p-3 border rounded transition-all flex justify-between items-center ${activeClientProject.approvedMilestones.design ? 'border-[#151515] text-[#737373] bg-[#050505]' : 'border-[#D46B4A]/40 hover:border-[#D46B4A] text-[#FAFAFA]'}`}
                  >
                    <span>▪ APPROVE HOMEPAGE DESIGN</span>
                    <span>{activeClientProject.approvedMilestones.design ? '✅ APPROVED' : 'APPROVE →'}</span>
                  </button>

                  <button
                    onClick={() => handleClientApprove('invoice')}
                    disabled={activeClientProject.approvedMilestones.invoice}
                    className={`w-full text-left p-3 border rounded transition-all flex justify-between items-center ${activeClientProject.approvedMilestones.invoice ? 'border-[#151515] text-[#737373] bg-[#050505]' : 'border-[#D46B4A]/40 hover:border-[#D46B4A] text-[#FAFAFA]'}`}
                  >
                    <span>▪ APPROVE DOWNPAYMENT INVOICE</span>
                    <span>{activeClientProject.approvedMilestones.invoice ? '✅ APPROVED' : 'APPROVE →'}</span>
                  </button>

                  <button
                    onClick={() => handleClientApprove('milestone')}
                    disabled={activeClientProject.approvedMilestones.milestone}
                    className={`w-full text-left p-3 border rounded transition-all flex justify-between items-center ${activeClientProject.approvedMilestones.milestone ? 'border-[#151515] text-[#737373] bg-[#050505]' : 'border-[#D46B4A]/40 hover:border-[#D46B4A] text-[#FAFAFA]'}`}
                  >
                    <span>▪ APPROVE BACKEND PROTOTYPE</span>
                    <span>{activeClientProject.approvedMilestones.milestone ? '✅ APPROVED' : 'APPROVE →'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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

export default ClientPortal;
