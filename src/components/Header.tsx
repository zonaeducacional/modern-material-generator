
import { BookOpen } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 bg-white glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center sm:justify-start gap-3 transition-all">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full blur opacity-60 group-hover:opacity-80 transition"></div>
            <div className="relative bg-white rounded-full p-2">
              <BookOpen className="text-primary h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Gerador de Materiais Didáticos
          </h1>
          <div className="hidden sm:block ml-2 px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
            BNCC
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
