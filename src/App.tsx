import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import InputPanel from './components/input/InputPanel';
import OutputPanel from './components/output/OutputPanel';
import ExamplesPage from './components/examples/ExamplesPage';
import SettingsPage from './components/settings/SettingsPage';

function GeneratePage() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
      <div className="w-full lg:w-[42%] xl:w-[38%] border-r border-[#E2E8F0] bg-white overflow-hidden">
        <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h2 className="text-sm font-semibold text-[#1E293B] flex items-center gap-1.5">
            📝 教学设计输入
          </h2>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">填写以下信息，右侧预览实时更新</p>
        </div>
        <div className="p-3">
          <InputPanel />
        </div>
      </div>
      <div className="w-full lg:w-[58%] xl:w-[62%] bg-white overflow-hidden flex flex-col min-h-0">
        <OutputPanel />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex flex-col min-h-0">
          <Routes>
            <Route path="/" element={<GeneratePage />} />
            <Route path="/examples" element={<ExamplesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
