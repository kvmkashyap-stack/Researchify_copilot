interface FooterProps {
  theme?: 'light' | 'dark';
}

export default function Footer({ theme = 'dark' }: FooterProps) {
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t transition-colors duration-300 ${
      isDark ? "border-white/10 bg-[#050505]" : "border-slate-200 bg-[#f8fafc]"
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-10">
        <p className={`text-sm transition-colors ${
          isDark ? "text-gray-500" : "text-slate-400"
        }`}>
          © 2026 AI Research Copilot
        </p>
      </div>
    </footer>
  );
}