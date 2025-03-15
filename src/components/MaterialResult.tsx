
import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface MaterialResultProps {
  content: string;
}

const MaterialResult = ({ content }: MaterialResultProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setIsCopied(true);
        toast.success("Material copiado para a área de transferência!");
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Erro ao copiar:", err);
        toast.error("Ocorreu um erro ao copiar o material.");
      });
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "material-didatico.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Material baixado com sucesso!");
  };

  return (
    <div className="mt-10 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Seu Material Didático
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium transition-all"
            aria-label="Copiar material"
          >
            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? "Copiado" : "Copiar"}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium transition-all"
            aria-label="Baixar material"
          >
            <Download className="w-4 h-4" />
            <span>Baixar</span>
          </button>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-10 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 left-0 h-10 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
        <pre className="bg-white rounded-xl p-6 text-foreground/90 whitespace-pre-wrap text-sm font-mono border border-border max-h-[60vh] overflow-y-auto">{content}</pre>
      </div>
      <div className="mt-4 py-3 px-4 bg-primary/10 rounded-lg flex items-center text-sm text-primary font-medium">
        <span className="mr-2">💡</span>
        <span>Você pode personalizar este material de acordo com as necessidades específicas de seus alunos.</span>
      </div>
    </div>
  );
};

export default MaterialResult;
