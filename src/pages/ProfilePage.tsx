import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
import { RadarChart } from '../components/visual/RadarChart';
import { User, Mail, Github, Linkedin, FileDown, Edit3, Check, Shield, Award, BookOpen, Layers, Save } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, updateUser, reports, achievements, completedLabs } = useUser();
  const { showToast } = useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title);
  const [bio, setBio] = useState(user.bio);
  const [github, setGithub] = useState(user.github);
  const [linkedin, setLinkedin] = useState(user.linkedin);
  const [email, setEmail] = useState(user.email);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      title,
      bio,
      github,
      linkedin,
      email,
    });
    setIsEditing(false);
    showToast('success', 'Profile Updated', 'Your researcher profile has been saved.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Profile Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-cyber-card border border-cyber-border shadow-card-glow relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-cyber-panel border-2 border-cyber-neonGreen p-1 shadow-glow-green overflow-hidden flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-cyber-panel to-[#0f2438] flex items-center justify-center font-mono font-black text-3xl text-cyber-neonGreen">
                  YL
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-cyber-neonGreen text-cyber-bg font-mono font-black text-[10px] uppercase">
                {user.level}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-cyber-neonGreen font-bold uppercase tracking-wider">
                  RESEARCHER DOSSIER
                </span>
                <span className="text-cyber-border">|</span>
                <span className="text-xs font-mono text-cyber-neonCyan">
                  {user.title}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-mono font-black text-cyber-textBright uppercase">
                {user.name}
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-cyber-textDim max-w-xl leading-relaxed">
                {user.bio}
              </p>

              {/* Social & Contact Links */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={user.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-neonCyan text-cyber-textBright font-mono text-xs transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-cyber-neonCyan" />
                  <span>GitHub</span>
                </a>
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-neonCyan text-cyber-textBright font-mono text-xs transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-cyber-neonCyan" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={`mailto:${user.email}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-neonCyan text-cyber-textBright font-mono text-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyber-neonGreen" />
                  <span>{user.email}</span>
                </a>
                <button
                  onClick={() => showToast('info', 'Resume Prepared', 'Downloading Yokesh_BE_Cybersecurity_Resume.pdf')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-neonGreen/15 border border-cyber-neonGreen text-cyber-neonGreen font-mono text-xs font-bold hover:bg-cyber-neonGreen/25 transition-all shadow-glow-green"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download Resume (PDF)</span>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-neonCyan text-cyber-textDim hover:text-cyber-textBright font-mono text-xs transition-colors self-start md:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyber-neonCyan" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-8 pt-6 border-t border-cyber-border space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold uppercase text-cyber-neonCyan mb-2">
              Edit Researcher Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-cyber-textMuted mb-1">Full Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
                />
              </div>
              <div>
                <label className="block text-cyber-textMuted mb-1">Academic Degree / Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
                />
              </div>
              <div>
                <label className="block text-cyber-textMuted mb-1">GitHub URL:</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
                />
              </div>
              <div>
                <label className="block text-cyber-textMuted mb-1">LinkedIn URL:</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-cyber-textMuted mb-1">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-cyber-textMuted mb-1">Bio Description:</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyber-neonGreen text-cyber-bg font-bold font-mono text-xs uppercase hover:bg-cyber-neonGreen/90 transition-all shadow-glow-green"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Grid: Skills Matrix & Academic Background */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Skills Competencies & Radar (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-cyber-card border border-cyber-border p-6 shadow-card-glow space-y-6">
          <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyber-neonGreen flex items-center gap-2">
              <Shield className="w-4 h-4" />
              CYBERSECURITY SKILLS ASSESSMENT
            </h3>
            <span className="text-[10px] font-mono text-cyber-neonCyan">PRACTITIONER</span>
          </div>

          <div className="flex items-center justify-center py-2">
            <RadarChart skills={user.skills} size={320} />
          </div>

          <div className="space-y-3 pt-2">
            {user.skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-cyber-textBright font-semibold">{skill.name}</span>
                  <span className="text-cyber-neonCyan">{skill.level}% Proficiency</span>
                </div>
                <div className="w-full h-1.5 bg-cyber-surface rounded-full overflow-hidden border border-cyber-border/40">
                  <div
                    className="h-full bg-gradient-to-r from-cyber-neonCyan to-cyber-neonGreen rounded-full"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Academic & Research Milestones (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Degree & Education Card */}
          <div className="rounded-2xl bg-cyber-card border border-cyber-border p-6 shadow-card-glow space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyber-textBright flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyber-neonCyan" />
              ACADEMIC CREDENTIALS
            </h3>

            <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border font-mono text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-cyber-textBright text-sm">B.E Computer Science & Engineering</span>
                <span className="text-cyber-neonGreen font-bold">Graduating 2027</span>
              </div>
              <p className="text-cyber-neonCyan">Specialization: Cyber Security & Defensive Architecture</p>
              <p className="text-cyber-textDim text-[11px] leading-relaxed pt-1">
                Core Coursework: Network Security, Cryptography, Application Security Testing, Linux System Administration, Ethical Hacking, Distributed Systems, Threat Modeling.
              </p>
            </div>
          </div>

          {/* Research Portfolio Summary */}
          <div className="rounded-2xl bg-cyber-card border border-cyber-border p-6 shadow-card-glow space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyber-textBright flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyber-neonAmber" />
              CAPSTONE PORTFOLIO PROJECTS
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div
                onClick={() => onNavigate('projects')}
                className="p-3.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-neonGreen transition-colors cursor-pointer"
              >
                <div className="flex justify-between font-bold text-cyber-textBright">
                  <span>AI Threat Resilience Strategy Dashboard</span>
                  <span className="text-cyber-neonGreen text-[10px]">CASE STUDY →</span>
                </div>
                <p className="text-[11px] text-cyber-textMuted mt-1">
                  Autonomous Cognitive Threat Modeling & Counter-Adversarial SOC Defense Engine
                </p>
              </div>

              <div
                onClick={() => onNavigate('projects')}
                className="p-3.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-neonGreen transition-colors cursor-pointer"
              >
                <div className="flex justify-between font-bold text-cyber-textBright">
                  <span>Real-Time Synthetic Voice Detection</span>
                  <span className="text-cyber-neonGreen text-[10px]">CASE STUDY →</span>
                </div>
                <p className="text-[11px] text-cyber-textMuted mt-1">
                  Multi-Spectral Neural Vocoder Biomarker Analysis for Deepfake Defense
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
