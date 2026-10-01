import React, { useState } from 'react';
import { LABS_DATA } from '../data/labsData';
import { useUser } from '../context/UserContext';
import { Search, Filter, Shield, Clock, Zap, CheckCircle2, ArrowRight, Sparkles, Layers } from 'lucide-react';

interface LabsPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const LabsPage: React.FC<LabsPageProps> = ({ onNavigate }) => {
  const { completedLabs } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const categories = ['All', 'Injection', 'Client-Side Security', 'Access Control', 'Authentication', 'Web Security', 'Input Validation'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const statuses = ['All', 'Available', 'Completed'];

  const filteredLabs = LABS_DATA.filter((lab) => {
    const matchesSearch =
      lab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.briefDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.technology.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || lab.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || lab.difficulty === selectedDifficulty;
    
    const isCompleted = completedLabs.includes(lab.slug);
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Completed' && isCompleted) ||
      (selectedStatus === 'Available' && !isCompleted);

    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-cyber-neonGreen font-bold uppercase tracking-wider mb-2">
          <Shield className="w-4 h-4" />
          <span>ISOLATED RESEARCH LABS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-mono font-black text-cyber-textBright uppercase">
          VULNERABLE LAB ENVIRONMENT
        </h1>
        <p className="mt-2 text-sm text-cyber-textDim max-w-2xl leading-relaxed">
          Practice security concepts inside intentionally vulnerable and isolated applications. Never connected to real-world targets.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-border mb-8 shadow-card-glow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-cyber-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search labs by name, vulnerability, or stack..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright placeholder-cyber-textMuted focus:outline-none focus:border-cyber-neonGreen"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
            >
              {categories.map((c) => (
                <option key={c} value={c}>Category: {c}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>Diff: {d}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>Status: {s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Category Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-cyber-border/60">
          <span className="text-[11px] font-mono text-cyber-textMuted mr-1">Quick Filters:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-cyber-neonGreen/20 border border-cyber-neonGreen text-cyber-neonGreen font-bold'
                  : 'bg-cyber-surface border border-cyber-border text-cyber-textMuted hover:text-cyber-textBright'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabs.map((lab) => {
          const isCompleted = completedLabs.includes(lab.slug);

          const difficultyBadge = {
            Beginner: 'text-cyber-neonGreen border-cyber-neonGreen/30 bg-cyber-neonGreen/10',
            Intermediate: 'text-cyber-neonCyan border-cyber-neonCyan/30 bg-cyber-neonCyan/10',
            Advanced: 'text-cyber-neonAmber border-cyber-neonAmber/30 bg-cyber-neonAmber/10',
            Expert: 'text-cyber-neonRed border-cyber-neonRed/30 bg-cyber-neonRed/10',
          }[lab.difficulty];

          return (
            <div
              key={lab.id}
              className="group flex flex-col justify-between p-6 rounded-2xl bg-cyber-card border border-cyber-border hover:border-cyber-neonGreen transition-all duration-300 shadow-card-glow hover:shadow-glow-green"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${difficultyBadge}`}>
                    {lab.difficulty}
                  </span>

                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-neonGreen/10 border border-cyber-neonGreen/30 text-cyber-neonGreen font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        COMPLETED
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonGreen font-bold">
                      +{lab.points} XP
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-cyber-neonCyan uppercase font-semibold">
                  {lab.category}
                </span>

                <h3 className="text-base font-mono font-bold text-cyber-textBright mt-1 group-hover:text-cyber-neonGreen transition-colors">
                  {lab.title}
                </h3>

                <p className="mt-2 text-xs text-cyber-textDim leading-relaxed">
                  {lab.briefDescription}
                </p>

                <div className="mt-4 flex items-center gap-4 text-[11px] font-mono text-cyber-textMuted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lab.estimatedMinutes} mins
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {lab.technology}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-cyber-border/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyber-textMuted">
                  {lab.tasks.length} Checkpoints
                </span>

                <button
                  onClick={() => onNavigate('lab-detail', lab.slug)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-surface border border-cyber-border group-hover:border-cyber-neonGreen text-cyber-textBright group-hover:text-cyber-neonGreen font-mono text-xs font-bold transition-all"
                >
                  <span>{isCompleted ? 'Revisit Lab' : 'Start Lab'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLabs.length === 0 && (
        <div className="py-16 text-center rounded-2xl bg-cyber-card border border-cyber-border font-mono">
          <p className="text-sm text-cyber-textMuted">
            No security labs found matching your filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};
