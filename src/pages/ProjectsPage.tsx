import React, { useState } from 'react';
import { PROJECTS_DATA } from '../data/projectsData';
import { ProjectCaseStudy } from '../types';
import { Layers, Shield, Cpu, ExternalLink, CheckCircle2, ChevronRight, Activity, Zap, ArrowUpRight } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy>(PROJECTS_DATA[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyber-neonGreen font-bold uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4" />
          <span>PORTFOLIO RESEARCH CASE STUDIES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-mono font-black text-cyber-textBright uppercase">
          CYBERSECURITY ENGINEERING PROJECTS
        </h1>
        <p className="mt-2 text-sm text-cyber-textDim max-w-2xl leading-relaxed">
          Production-grade cybersecurity architectures, AI threat resilience strategies, and acoustic deepfake detection systems engineered for defense.
        </p>
      </div>

      {/* Projects Showcase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROJECTS_DATA.map((proj) => {
          const isSelected = proj.id === selectedProject.id;
          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyber-card border-cyber-neonGreen shadow-glow-green'
                  : 'bg-cyber-card/60 border-cyber-border hover:border-cyber-borderGlow'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonCyan font-bold uppercase block w-fit mb-3">
                  {proj.status.split(' ')[0]}
                </span>
                <h3 className="text-base font-mono font-bold text-cyber-textBright leading-snug">
                  {proj.title}
                </h3>
                <p className="mt-2 text-xs text-cyber-textDim leading-relaxed line-clamp-3">
                  {proj.tagline}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-cyber-border/60 flex items-center justify-between text-xs font-mono">
                <span className="text-cyber-textMuted">{proj.technology.slice(0, 2).join(', ')}</span>
                <span className="text-cyber-neonGreen flex items-center gap-1 font-bold">
                  View Dossier →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Full Technical Case Study Dossier */}
      <div className="rounded-3xl bg-cyber-card border border-cyber-border p-6 sm:p-10 shadow-card-glow space-y-8">
        {/* Project Header */}
        <div className="border-b border-cyber-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-neonGreen/10 border border-cyber-neonGreen/30 text-cyber-neonGreen font-bold">
                {selectedProject.status}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-black text-cyber-textBright uppercase">
              {selectedProject.title}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-cyber-neonCyan mt-1 font-medium">
              {selectedProject.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedProject.technology.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textDim"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {selectedProject.metrics.map((metric) => (
            <div key={metric.label} className="p-4 rounded-xl bg-cyber-surface border border-cyber-border">
              <span className="text-[10px] font-mono text-cyber-textMuted uppercase block">
                {metric.label}
              </span>
              <span className="text-2xl font-mono font-black text-cyber-neonGreen mt-1 block">
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        {/* Problem vs Solution Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-cyber-surface/60 border border-cyber-border space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-cyber-neonAmber tracking-wider block">
              The Security Problem & Threat Landscape:
            </span>
            <p className="text-xs sm:text-sm text-cyber-textDim leading-relaxed font-sans">
              {selectedProject.problem}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cyber-surface/60 border border-cyber-border space-y-2 shadow-glow-green">
            <span className="text-xs font-mono font-bold uppercase text-cyber-neonGreen tracking-wider block">
              The Engineering Architecture & Solution:
            </span>
            <p className="text-xs sm:text-sm text-cyber-textDim leading-relaxed font-sans">
              {selectedProject.solution}
            </p>
          </div>
        </div>

        {/* Architecture Components */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold uppercase text-cyber-neonCyan tracking-wider block">
            System Architecture & Pipeline:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedProject.architecture.map((arch, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-cyber-surface border border-cyber-border flex items-start gap-2.5 font-mono text-xs"
              >
                <span className="text-cyber-neonGreen font-bold">{idx + 1}.</span>
                <span className="text-cyber-textDim leading-relaxed">{arch}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features & Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-cyber-border/60">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-cyber-textBright tracking-wider block mb-3">
              Core Technical Features:
            </span>
            <ul className="space-y-2">
              {selectedProject.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-xs font-mono text-cyber-textDim leading-relaxed">
                  <span className="text-cyber-neonGreen mt-0.5">›</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase text-cyber-textBright tracking-wider block mb-3">
              Security Impact & Resilience:
            </span>
            <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border font-mono text-xs text-cyber-textDim leading-relaxed">
              {selectedProject.securityImpact}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
