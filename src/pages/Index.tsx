
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MaterialForm from "@/components/MaterialForm";
import MaterialResult from "@/components/MaterialResult";
import { BookOpen, GraduationCap, Brain, PenLine, Target } from "lucide-react";

const Index = () => {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleSubmit = (content: string) => {
    setGeneratedContent(content);
    // Scroll to result section smoothly
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-10">
          <div>
            <div className="mb-6 space-y-2">
              <div className="inline-block px-2.5 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-2 subtle-animate hover:bg-primary/15">
                Ferramenta para Professores
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-balance">
                Crie materiais didáticos alinhados à BNCC em poucos segundos
              </h2>
              <p className="text-muted-foreground text-balance">
                Preencha o formulário ao lado e deixe nossa IA criar conteúdos personalizados para suas aulas.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: <BookOpen className="h-5 w-5 text-primary" />,
                  title: "Alinhado à BNCC",
                  description: "Todos os materiais seguem as diretrizes curriculares nacionais."
                },
                {
                  icon: <GraduationCap className="h-5 w-5 text-primary" />,
                  title: "Para todos os níveis",
                  description: "Da educação infantil ao ensino médio, temos conteúdos adequados."
                },
                {
                  icon: <Brain className="h-5 w-5 text-primary" />,
                  title: "Inteligência Artificial",
                  description: "Tecnologia avançada para criar conteúdos personalizados."
                },
                {
                  icon: <PenLine className="h-5 w-5 text-primary" />,
                  title: "Diversos formatos",
                  description: "Planos de aula, quizzes, projetos e muito mais."
                }
              ].map((item, index) => (
                <div key={index} className="glass p-4 rounded-xl flex flex-col gap-2 subtle-animate hover:translate-y-[-2px]">
                  <div className="neomorphic inline-flex p-2 rounded-lg mb-2">
                    {item.icon}
                  </div>
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass p-6 md:p-8 rounded-xl">
            <MaterialForm onSubmit={handleSubmit} />
          </div>
        </div>
        
        {generatedContent && <MaterialResult content={generatedContent} />}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
