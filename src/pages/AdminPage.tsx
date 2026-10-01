import React, { useState } from 'react';
import { LABS_DATA } from '../data/labsData';
import { Lab, DifficultyLevel } from '../types';
import { useNotification } from '../context/NotificationContext';
import { Settings, Plus, Edit2, Trash2, Eye, EyeOff, Shield, Check, X, Layers, FileCode } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { showToast } = useNotification();
  const [labs, setLabs] = useState<Lab[]>(LABS_DATA);
  const [editingLab, setEditingLab] = useState<Lab | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Lab['category']>('Injection');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [technology, setTechnology] = useState('Node.js / Express');
  const [points, setPoints] = useState(150);
  const [estimatedMinutes, setEstimatedMinutes] = useState(25);
  const [briefDescription, setBriefDescription] = useState('');
  const [targetEndpoint, setTargetEndpoint] = useState('POST /api/v1/test');

  const handleTogglePublish = (labId: string) => {
    setLabs(prev => prev.map(l => {
      if (l.id === labId) {
        const nextState = !l.isAvailable;
        showToast('info', 'Lab Status Changed', `${l.title} is now ${nextState ? 'Published' : 'Unpublished'}.`);
        return { ...l, isAvailable: nextState };
      }
      return l;
    }));
  };

  const handleSaveLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isCreatingNew) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newLab: Lab = {
        id: `lab-custom-${Date.now()}`,
        slug,
        title,
        category,
        difficulty,
        technology,
        points,
        estimatedMinutes,
        isAvailable: true,
        isCompleted: false,
        briefDescription,
        fullDescription: briefDescription,
        learningObjectives: [
          'Understand attack surface of the target simulated component.',
          'Analyze payload processing in isolated sandbox.',
          'Apply secure coding pattern and verify defenses.'
        ],
        tasks: [
          { id: 't1', text: 'Identify vulnerability trigger in demo endpoint.', completed: false },
          { id: 't2', text: 'Inspect HTTP payload in security console.', completed: false },
          { id: 't3', text: 'Review secure coding diff.', completed: false }
        ],
        hints: [
          { level: 1, costXp: 0, content: 'Analyze input validation controls.', unlocked: true },
          { level: 2, costXp: 10, content: 'Review the simulated database query parameters.', unlocked: false }
        ],
        demoAppUrl: 'https://shop.secureleo.local',
        demoAppTitle: 'Custom Lab Demo Application',
        targetEndpoint,
        workflowStage: 'discover',
        remediationCode: {
          language: 'javascript',
          vulnerable: '// Vulnerable implementation\napp.post(...)',
          secure: '// Secure implementation\napp.post(...)',
          explanation: 'Apply strict validation and parameterized handlers.'
        }
      };

      setLabs(prev => [newLab, ...prev]);
      showToast('success', 'Lab Created', `Lab "${title}" successfully registered in the platform catalog.`);
      setIsCreatingNew(false);
    } else if (editingLab) {
      setLabs(prev => prev.map(l => l.id === editingLab.id ? {
        ...l,
        title,
        category,
        difficulty,
        technology,
        points,
        estimatedMinutes,
        briefDescription,
        targetEndpoint,
      } : l));
      showToast('success', 'Lab Updated', `Lab "${title}" changes applied.`);
      setEditingLab(null);
    }
  };

  const handleStartEdit = (lab: Lab) => {
    setEditingLab(lab);
    setIsCreatingNew(false);
    setTitle(lab.title);
    setCategory(lab.category);
    setDifficulty(lab.difficulty);
    setTechnology(lab.technology);
    setPoints(lab.points);
    setEstimatedMinutes(lab.estimatedMinutes);
    setBriefDescription(lab.briefDescription);
    setTargetEndpoint(lab.targetEndpoint);
  };

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setEditingLab(null);
    setTitle('');
    setCategory('Injection');
    setDifficulty('Intermediate');
    setTechnology('Node.js / SQLite');
    setPoints(150);
    setEstimatedMinutes(20);
    setBriefDescription('');
    setTargetEndpoint('POST /api/v1/test');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyber-neonGreen font-bold uppercase tracking-wider mb-2">
            <Settings className="w-4 h-4" />
            <span>SIMULATED PLATFORM ADMINISTRATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-mono font-black text-cyber-textBright uppercase">
            ADMIN LAB MANAGEMENT
          </h1>
          <p className="mt-2 text-sm text-cyber-textDim max-w-2xl leading-relaxed">
            Curate security labs, adjust XP reward weights, publish/unpublish challenges, and configure learning objectives.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-neonGreen text-cyber-bg font-mono font-bold text-xs uppercase hover:bg-cyber-neonGreen/90 transition-all shadow-glow-green"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Lab</span>
        </button>
      </div>

      {/* Lab Create/Edit Modal Form */}
      {(isCreatingNew || editingLab) && (
        <form onSubmit={handleSaveLab} className="p-6 sm:p-8 rounded-2xl bg-cyber-card border border-cyber-border shadow-card-glow space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-cyber-border pb-3">
            <h3 className="text-sm font-bold uppercase text-cyber-neonCyan">
              {isCreatingNew ? 'Create New Vulnerable Lab' : `Edit Lab: ${editingLab?.title}`}
            </h3>
            <button
              type="button"
              onClick={() => { setIsCreatingNew(false); setEditingLab(null); }}
              className="text-cyber-textMuted hover:text-cyber-textBright"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-cyber-textMuted mb-1">Lab Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
                required
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-cyber-textMuted mb-1">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
              >
                {['Injection', 'Client-Side Security', 'Access Control', 'Authentication', 'Web Security', 'Input Validation', 'API Security'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-cyber-textMuted mb-1">Difficulty:</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
              >
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-cyber-textMuted mb-1">XP Points:</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-cyber-textMuted mb-1">Est. Minutes:</label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-cyber-textMuted mb-1">Technology Stack:</label>
              <input
                type="text"
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
              />
            </div>

            <div className="sm:col-span-12">
              <label className="block text-cyber-textMuted mb-1">Target Endpoint:</label>
              <input
                type="text"
                value={targetEndpoint}
                onChange={(e) => setTargetEndpoint(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
              />
            </div>

            <div className="sm:col-span-12">
              <label className="block text-cyber-textMuted mb-1">Brief Description:</label>
              <textarea
                rows={2}
                value={briefDescription}
                onChange={(e) => setBriefDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setIsCreatingNew(false); setEditingLab(null); }}
              className="px-4 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textMuted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyber-neonGreen text-cyber-bg font-bold uppercase"
            >
              Save Lab Configuration
            </button>
          </div>
        </form>
      )}

      {/* Labs List Table */}
      <div className="rounded-2xl bg-cyber-card border border-cyber-border overflow-hidden shadow-card-glow">
        <div className="p-4 bg-cyber-panel border-b border-cyber-border flex items-center justify-between font-mono text-xs">
          <span className="font-bold text-cyber-textBright">REGISTERED PLATFORM LABS ({labs.length})</span>
          <span className="text-cyber-textMuted">SIMULATED ADMIN ACCESS</span>
        </div>

        <div className="divide-y divide-cyber-border/40 font-mono text-xs">
          {labs.map((lab) => (
            <div key={lab.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cyber-surface/40 transition-colors">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-cyber-textBright">{lab.title}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyber-panel border border-cyber-border text-cyber-neonCyan">
                    {lab.category}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyber-panel border border-cyber-border text-cyber-neonGreen">
                    {lab.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-cyber-textDim truncate max-w-xl">
                  {lab.briefDescription}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-cyber-textMuted mt-1">
                  <span>Target: {lab.targetEndpoint}</span>
                  <span>XP: +{lab.points}</span>
                  <span>{lab.estimatedMinutes} mins</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <button
                  onClick={() => handleTogglePublish(lab.id)}
                  className={`p-2 rounded-lg border flex items-center gap-1 text-[11px] ${
                    lab.isAvailable
                      ? 'bg-cyber-neonGreen/10 border-cyber-neonGreen/30 text-cyber-neonGreen'
                      : 'bg-cyber-panel border-cyber-border text-cyber-textMuted'
                  }`}
                  title={lab.isAvailable ? 'Unpublish Lab' : 'Publish Lab'}
                >
                  {lab.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{lab.isAvailable ? 'Published' : 'Hidden'}</span>
                </button>

                <button
                  onClick={() => handleStartEdit(lab)}
                  className="p-2 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-neonCyan text-cyber-textDim hover:text-cyber-neonCyan"
                  title="Edit Lab Details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
