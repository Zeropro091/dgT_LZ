import React, { useState, useEffect } from 'react';
import { formatTime } from './sharedData.js';

const TeamPortal = ({
  tasks,
  setTasks,
  projects,
  leads,
  onBackHome
}) => {
  // ── Auth ──────────────────────────────────────────────
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  // ── Forms & CRUD State ───────────────────────────────
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', assignee: 'Ari', priority: 'High', status: 'Backlog', description: '', timeSpent: 0 });

  // ── AI Chat Terminal ──────────────────────────────────
  const [aiInput, setAiInput] = useState('');
  const [aiFeed, setAiFeed] = useState([
    { sender: 'AI', text: 'Consolidating operational cache. Agency OS v2.0 AI Brain online. Ask me anything.' }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // ── Alert State ───────────────────────────────────────
  const [alertMsg, setAlertMsg] = useState('');

  // ── Navigation ────────────────────────────────────────
  const [activeSubTab, setActiveSubTab] = useState('team_dashboard');

  // ── Prompt Blueprint State ────────────────────────────
  const [agentRole, setAgentRole] = useState('Digital Architect Agent');
  const [agentTone, setAgentTone] = useState('Direct, Technical, Minimalist');
  const [agentTemp, setAgentTemp] = useState('0.7');
  const [agentChannel, setAgentChannel] = useState('LinkedIn Cold Outreach');
  const [compiledPrompt, setCompiledPrompt] = useState('');
  const [isCompilingPrompt, setIsCompilingPrompt] = useState(false);

  // Terminal State for AI Dev tools
  const [terminalOutput, setTerminalOutput] = useState('');
  const [isTerminalLoading, setIsTerminalLoading] = useState(false);

  // ─────────────────────────────────────────────────────
  // FUNCTIONS
  // ─────────────────────────────────────────────────────

  const triggerAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 2500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'team' && password === 'team123') {
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

  // Timer toggling mechanics
  const handleToggleTimer = (taskId, e) => {
    e.stopPropagation();
    setTasks(prevTasks =>
      prevTasks.map(t => {
        if (t.id === taskId) {
          if (t.timerRunning) {
            const startedAt = t.timerStartedAt || Date.now();
            const session = Math.floor((Date.now() - startedAt) / 1000);
            const total = (t.timeSpent || 0) + session;
            return {
              ...t,
              timerRunning: false,
              timeSpent: total,
              elapsedSeconds: total
            };
          } else {
            return {
              ...t,
              timerRunning: true,
              timerStartedAt: Date.now(),
              elapsedSeconds: t.timeSpent || 0
            };
          }
        }
        return t;
      })
    );
  };

  // Local formatTime (matches Dashboard's inline version)
  const localFormatTime = (totalSeconds) => {
    if (!totalSeconds) return '0s';
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}j ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDropTask = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      setTasks(prevTasks =>
        prevTasks.map(t => t.id === taskId ? { ...t, status: targetStatus } : t)
      );
    }
  };

  // Task CRUD Handlers
  const handleSaveTask = (e) => {
    e.preventDefault();
    if (editingTaskId) {
      setTasks(prev => prev.map(t => t.id === editingTaskId ? { ...t, ...taskForm, timeSpent: Number(taskForm.timeSpent) } : t));
      triggerAlert('Task updated successfully!');
    } else {
      const newTaskObj = {
        ...taskForm,
        id: 'TSK-' + Date.now().toString().slice(-4),
        timeSpent: Number(taskForm.timeSpent),
        timerRunning: false,
        elapsedSeconds: 0
      };
      setTasks(prev => [...prev, newTaskObj]);
      triggerAlert('New task injected successfully!');
    }
    setTaskForm({ title: '', assignee: 'Ari', priority: 'High', status: 'Backlog', description: '', timeSpent: 0 });
    setIsAddingTask(false);
    setEditingTaskId(null);
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      assignee: task.assignee,
      priority: task.priority,
      status: task.status,
      description: task.description || '',
      timeSpent: task.timeSpent || 0
    });
    setIsAddingTask(true);
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    triggerAlert('Task deleted successfully!');
  };

  const runCodeReview = () => {
    setIsTerminalLoading(true);
    setTerminalOutput('Starting Code Review Compiler...\nScanning active workspace /src/...\n');
    setTimeout(() => {
      const activeTask = tasks.find(t => t.timerRunning) || tasks[0];
      setTerminalOutput(prev => prev + `Target Task: [${activeTask?.id || 'GLOBAL'}] ${activeTask?.title || 'System architecture'}\nRunning syntax checks...\nValidating import paths...\nChecking modular logic...\n\n[AI REVIEW OUTPUT]\n- No unused variables or imports found.\n- Component structure follows DGT functional principles.\n- Suggestion: Consider lifting state to parent component if sharing is required across routes.`);
      setIsTerminalLoading(false);
    }, 1200);
  };

  const generateTestCases = () => {
    setIsTerminalLoading(true);
    setTerminalOutput('Initializing Jest Test Generator...\nTarget: App.jsx & portal routers...\n');
    setTimeout(() => {
      const activeTask = tasks.find(t => t.timerRunning) || tasks[0];
      setTerminalOutput(prev => prev + `Target Task: [${activeTask?.id || 'GLOBAL'}] ${activeTask?.title || 'System architecture'}\nCompiling mock data layers...\nGenerating unit tests...\n\n[GENERATED TESTS]\n1. describe("${activeTask?.title || 'Component'} Component", () => {\n     it("renders without crashing", () => {\n       render(<${activeTask?.title?.replace(/\s+/g, '') || 'Portal'} />);\n     });\n   });\n\n- Tests generated: 3 passing, 0 failing.\n- Saved to /src/__tests__/Portal.test.jsx`);
      setIsTerminalLoading(false);
    }, 1200);
  };

  const compileApiDocs = () => {
    setIsTerminalLoading(true);
    setTerminalOutput('Scanning directory schemas...\nExtracting jsdoc definitions...\n');
    setTimeout(() => {
      const activeTask = tasks.find(t => t.timerRunning) || tasks[0];
      setTerminalOutput(prev => prev + `Target Task: [${activeTask?.id || 'GLOBAL'}] ${activeTask?.title || 'System architecture'}\nGenerating OpenAPI v3 schema documentation...\n\n[API DOCUMENTATION]\n- GET /api/v1/projects\n  Description: Returns list of operational projects.\n- POST /api/v1/projects/:id/publish\n  Description: Publishes operational update timeline message.\n- Status: 200 OK - application/json schema exported.`);
      setIsTerminalLoading(false);
    }, 1200);
  };

  // AI GPT Answer Engine (Dynamic Live Data queries)
  const askAiBrain = (queryText) => {
    if (!queryText.trim()) return;

    setAiFeed(prev => [...prev, { sender: 'User', text: queryText }]);
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = "I'm processing this query against the Live Shared Data Layer. Can you please choose one of the predefined blueprints or ask about risk, timeline, sprint tasks, or finances?";

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
        reply = `PROPOSAL GENERATOR:\n\n# DIGITAL ARCHITECTURE AUDIT PROPOSAL\n- Client: ${targetLead.clientName}\n- Proposed Budget: Rp ${targetLead.value.toLocaleString('id-ID')}\n- Deliverables: ${targetLead.brief}\n- Timeline: 4 Weeks.`;
      } else if (q.includes('task') || q.includes('sprint') || q.includes('todo') || q.includes('tugas') || q.includes('kerjaan') || q.includes('sisa')) {
        const unfinished = tasks.filter(t => t.status !== 'Done');
        if (unfinished.length > 0) {
          const list = unfinished.map(t => `- [${t.id}] ${t.title} (${t.status})`).join('\n');
          reply = `ACTIVE SPRINT WORKLOAD:\n${list}`;
        } else {
          reply = "AI ANALYSIS: All active sprint tasks have been marked as completed. Ready for retro and next sprint planning.";
        }
      } else if (q.includes('finance') || q.includes('keuangan') || q.includes('budget') || q.includes('biaya')) {
        const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
        reply = `PROJECT PORTFOLIO BUDGETS:\n- Total Managed Budget: Rp ${totalBudget.toLocaleString('id-ID')}\n- Active projects: ${projects.length}`;
      }

      setAiFeed(prev => [...prev, { sender: 'AI', text: reply }]);
      setIsAiThinking(false);
    }, 600);

    setAiInput('');
  };

  // Prompt Blueprint Compiler
  const compilePromptBlueprint = () => {
    setIsCompilingPrompt(true);
    setCompiledPrompt('');

    const output = `[SYSTEM ROLE]\nName: DGT_${agentRole.replace(/\s+/g, '')}\nInstructions: Act as a custom DGT otonom agent with temperature ${agentTemp}. Target channel is ${agentChannel}.\n\n[TONE OF VOICE]\n${agentTone}\n\n[PROMPT CODE]\nCompile custom digital architecture for client brief. Restructure all manual entry pipelines to scale operations. Highlight volcan terracotta highlights.`;

    setTimeout(() => {
      setCompiledPrompt(output);
      setIsCompilingPrompt(false);
    }, 800);
  };

  // ── TIMER TICK useEffect ─────────────────────────────
  useEffect(() => {
    const hasRunning = tasks.some(t => t.timerRunning);
    if (!hasRunning) return;

    const interval = setInterval(() => {
      setTasks(prevTasks =>
        prevTasks.map(t => {
          if (t.timerRunning && t.timerStartedAt) {
            const session = Math.floor((Date.now() - t.timerStartedAt) / 1000);
            return { ...t, elapsedSeconds: (t.timeSpent || 0) + session };
          }
          return t;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  // ── NAV ITEMS ─────────────────────────────────────────
  const navItems = [
    { id: 'team_dashboard', number: '01', label: 'Task Dashboard' },
    { id: 'team_kanban', number: '02', label: 'Kanban Board' },
    { id: 'team_assistant', number: '03', label: 'AI Developer' },
    { id: 'team_ai_brain', number: '04', label: 'AI Brain' },
    { id: 'team_ai_blueprints', number: '05', label: 'Prompt Blueprints' }
  ];

  // ── LOGGED-IN RENDER ─────────────────────────────────
  if (isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-[#0D0D0D] text-[#FAFAFA] overflow-hidden font-sans selection:bg-[#D46B4A] selection:text-white transition-colors duration-300">
        {/* Header */}
        <header className="border-b border-[#151515] flex items-center justify-between px-4 sm:px-8 h-[80px] shrink-0 z-20 bg-[#0D0D0D]">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="font-maroni text-2xl sm:text-[38px] leading-none tracking-[-1px] m-0 p-0 text-[#FAFAFA] hover:text-[#D46B4A] transition-colors cursor-pointer select-none">
              Agency OS.
            </h1>
            <span className="text-[8px] font-mono text-[#D46B4A] border border-[#D46B4A]/20 px-2 py-0.5 rounded bg-[#D46B4A]/5 uppercase tracking-widest font-bold">V2.0</span>
            <span className="hidden sm:inline text-[9px] font-mono text-[#737373] uppercase tracking-wider pl-2 border-l border-[#151515] font-bold">Team Portal</span>
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

            {/* Tasks Add/Edit Form Box */}
            {isAddingTask && (
              <div className="border border-[#151515] p-5 bg-[#070707] rounded max-w-md mb-8">
                <form onSubmit={handleSaveTask} className="flex flex-col gap-3 font-mono text-[9px]">
                  <span className="text-[#D46B4A] font-bold uppercase">{editingTaskId ? 'Edit Sprint Task' : 'Register New Sprint Task'}</span>
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Assignee (e.g. Ari, Made)"
                    value={taskForm.assignee}
                    onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                    className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                    required
                  />
                  <textarea
                    placeholder="Description / Requirements"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white h-16 resize-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="bg-[#050505] border border-[#151515] outline-none p-2 text-white"
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </select>
                    <select
                      value={taskForm.status}
                      onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                      className="bg-[#050505] border border-[#151515] outline-none p-2 text-white"
                    >
                      <option value="Backlog">Backlog</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <input
                    type="number"
                    placeholder="Time Spent (seconds)"
                    value={taskForm.timeSpent || ''}
                    onChange={(e) => setTaskForm({ ...taskForm, timeSpent: Number(e.target.value) })}
                    className="bg-transparent border border-[#151515] focus:border-[#D46B4A] outline-none p-2 text-white"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-[#D46B4A] text-white px-4 py-2 font-bold uppercase rounded">Save</button>
                    <button type="button" onClick={() => setIsAddingTask(false)} className="border border-[#151515] text-[#737373] px-4 py-2 font-bold uppercase rounded">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* TEAM SUBTABS */}
            {activeSubTab === 'team_dashboard' && (
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center border-b border-[#151515] pb-2">
                  <div>
                    <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">TEAM // DASHBOARD</span>
                    <h3 className="text-3xl font-syne font-extrabold tracking-tight text-[#FAFAFA]">Tasks Board</h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsAddingTask(true);
                      setEditingTaskId(null);
                      setTaskForm({ title: '', assignee: 'Ari', priority: 'High', status: 'Backlog', description: '', timeSpent: 0 });
                    }}
                    className="bg-[#D46B4A] hover:bg-[#c25a3a] text-white font-mono text-[9px] font-bold px-3 py-1.5 uppercase rounded"
                  >
                    + Add Task
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {tasks.map(t => (
                    <div key={t.id} className="border border-[#151515] bg-[#070707] p-5 flex justify-between items-center rounded hover:border-[#D46B4A] transition-all">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[7px] text-[#737373] block">{t.id} // {t.status}</span>
                          <span className={`text-[7px] font-mono font-bold px-1.5 py-0.5 rounded border ${t.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-[#111] text-[#FAFAFA] border-[#151515]'}`}>{t.priority}</span>
                        </div>
                        <h4 className="font-clash text-[#FAFAFA] text-base mt-1">{t.title}</h4>
                        {t.description && <p className="text-[10px] text-[#737373] mt-1">{t.description}</p>}
                        <span className="font-mono text-[8px] text-[#737373] mt-2 block">ASSIGNEE: {t.assignee}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => handleToggleTimer(t.id, e)}
                          className={`font-mono text-[9px] font-bold px-3 py-1.5 border rounded transition-all ${t.timerRunning ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-[#737373] border-[#151515] hover:text-[#D46B4A]'}`}
                        >
                          ⏱️ {t.timerRunning ? localFormatTime(t.elapsedSeconds) : (t.timeSpent > 0 ? localFormatTime(t.timeSpent) : 'START')}
                        </button>
                        <button
                          onClick={() => handleEditTask(t)}
                          className="text-[8px] font-mono border border-[#151515] hover:border-[#D46B4A] text-white px-2.5 py-1.5 uppercase rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(t.id)}
                          className="text-[8px] font-mono border border-[#151515] hover:border-red-500/40 text-red-400 px-2.5 py-1.5 uppercase rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === 'team_kanban' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-[#151515] pb-2">
                  <h3 className="text-3xl font-syne font-extrabold tracking-tight text-[#FAFAFA]">Sprint Kanban</h3>
                  <button
                    onClick={() => {
                      setIsAddingTask(true);
                      setEditingTaskId(null);
                      setTaskForm({ title: '', assignee: 'Ari', priority: 'High', status: 'Backlog', description: '', timeSpent: 0 });
                    }}
                    className="bg-[#D46B4A] text-white font-mono text-[9px] font-bold px-2 py-1 rounded uppercase"
                  >
                    + Create Sprint Task
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Backlog', 'In Progress', 'Done'].map(status => {
                    const statusTasks = tasks.filter(t => t.status === status);
                    return (
                      <div
                        key={status}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropTask(e, status)}
                        className="border border-[#151515] bg-[#070707] p-3 min-h-[280px] flex flex-col gap-3 rounded"
                      >
                        <span className="font-mono text-[8px] text-[#D46B4A] font-bold uppercase border-b border-[#151515] pb-1">{status} ({statusTasks.length})</span>
                        {statusTasks.map(t => (
                          <div
                            key={t.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, t.id)}
                            className="border border-[#151515] bg-[#050505] p-3 flex flex-col justify-between gap-3 cursor-grab rounded group hover:border-[#D46B4A] transition-all"
                          >
                            <div>
                              <h5 className="text-[10px] font-bold text-[#FAFAFA] leading-tight">{t.title}</h5>
                              <span className="text-[7px] text-[#737373] font-mono uppercase mt-1 block">Priority: {t.priority}</span>
                            </div>
                            <div className="flex justify-between items-center text-[7px] font-mono text-[#737373] border-t border-[#151515] pt-1.5">
                              <span>T: {t.assignee}</span>
                              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditTask(t)} className="text-white hover:text-[#D46B4A]">Edit</button>
                                <button onClick={() => handleDeleteTask(t.id)} className="text-red-400 hover:text-red-300">Del</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeSubTab === 'team_assistant' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[9px] font-mono text-[#D46B4A] uppercase font-bold tracking-widest">TEAM // AI CODER</span>
                  <h3 className="text-3xl font-syne font-extrabold tracking-tight text-[#FAFAFA]">AI Developer</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-[9px] mb-6">
                  <button
                    onClick={runCodeReview}
                    className="p-4 border border-[#151515] bg-[#070707] hover:border-[#D46B4A] hover:bg-[#D46B4A]/5 text-[#FAFAFA] uppercase text-left rounded"
                  >
                    ▪ Run Code Review
                  </button>
                  <button
                    onClick={generateTestCases}
                    className="p-4 border border-[#151515] bg-[#070707] hover:border-[#D46B4A] hover:bg-[#D46B4A]/5 text-[#FAFAFA] uppercase text-left rounded"
                  >
                    ▪ Generate Test Cases
                  </button>
                  <button
                    onClick={compileApiDocs}
                    className="p-4 border border-[#151515] bg-[#070707] hover:border-[#D46B4A] hover:bg-[#D46B4A]/5 text-[#FAFAFA] uppercase text-left rounded"
                  >
                    ▪ Compile API Docs
                  </button>
                </div>

                {isTerminalLoading && (
                  <div className="text-[9px] font-mono text-[#D46B4A] animate-pulse mb-4">Compiling workspace files...</div>
                )}

                {terminalOutput && (
                  <div className="border border-[#151515] bg-[#050505] p-5 rounded font-mono text-[9px] text-[#FAFAFA] flex flex-col gap-2 max-w-xl">
                    <div className="flex justify-between items-center border-b border-[#151515] pb-2 text-[#737373] text-[8px] uppercase tracking-wider font-bold">
                      <span>Console Logs</span>
                      <button onClick={() => setTerminalOutput('')} className="hover:text-white uppercase">[Clear]</button>
                    </div>
                    <pre className="whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar">
                      {terminalOutput}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'team_ai_brain' && (
              <div className="flex flex-col gap-6 min-h-[420px] justify-between">
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

            {activeSubTab === 'team_ai_blueprints' && (
              <div className="flex flex-col gap-6">
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
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#151515] flex items-center justify-between px-8 text-[9px] font-mono text-[#737373] uppercase tracking-wider shrink-0 bg-[#0D0D0D] h-12">
          <p>&copy; 2026 AGENCY COMMAND. NO OVERLAP. ALL ALIGNED.</p>
          <p>LATENCY: 12MS / SYSTEM STABLE</p>
        </footer>
      </div>
    );
  }

  // ── LOGIN SCREEN ─────────────────────────────────────
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
          <h2 className="text-xl font-clash text-[#FAFAFA]">Team Portal Access</h2>
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
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamPortal;
