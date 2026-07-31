import { useState } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { Scope1Section } from './components/Scope1Section';
import { Scope2Section } from './components/Scope2Section';
import { Scope3Section } from './components/Scope3Section';
import { TimelineMatrixSection } from './components/TimelineMatrixSection';
import { ProofDashboardSection } from './components/ProofDashboardSection';
import { FooterSection } from './components/FooterSection';
import { CorpusViewerModal } from './components/CorpusViewerModal';
import { BookOpen } from 'lucide-react';
import { audioEngine } from './utils/audio';

export function App() {
  const [isCorpusOpen, setIsCorpusOpen] = useState(false);

  const openCorpus = () => {
    audioEngine.playCyberSweep();
    setIsCorpusOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 selection:bg-rose-500 selection:text-white relative">
      {/* Header Navigation */}
      <HeaderNav onOpenCorpus={openCorpus} />

      {/* Main Narrative & Interactive Workbench Flow */}
      <main className="space-y-16 relative z-10">
        <HeroSection />
        <ProblemSection />
        <Scope1Section />
        <Scope2Section />
        <Scope3Section />
        <TimelineMatrixSection />
        <ProofDashboardSection />
      </main>

      {/* Footer Section */}
      <FooterSection onOpenCorpus={openCorpus} />

      {/* Single-File Corpus Reader Modal */}
      <CorpusViewerModal isOpen={isCorpusOpen} onClose={() => setIsCorpusOpen(false)} />

      {/* Floating Action Button for Corpus Quick Launcher */}
      <button
        onClick={openCorpus}
        title="Open llms-full.txt Monograph Corpus"
        className="fixed bottom-6 right-6 z-40 px-4 py-3 cyber-panel-crimson border border-rose-500/60 shadow-2xl text-rose-300 hover:text-white font-mono text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all group"
      >
        <div className="cyber-corner-crimson-tl" />
        <div className="cyber-corner-crimson-br" />
        <BookOpen className="w-4 h-4 text-rose-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Monograph Context Corpus</span>
      </button>
    </div>
  );
}

export default App;
