
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Calendar, 
  Clock, 
  FileText, 
  PenLine, 
  Send, 
  Target, 
  Users, 
  BookOpen, 
  Layers, 
  Layout, 
  FileQuestion 
} from "lucide-react";

interface MaterialFormProps {
  onSubmit: (content: string) => void;
}

const MaterialForm = ({ onSubmit }: MaterialFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [materialType, setMaterialType] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showDurationField, setShowDurationField] = useState(false);
  const [showQuizTextField, setShowQuizTextField] = useState(false);
  const [showDisciplineField, setShowDisciplineField] = useState(false);

  useEffect(() => {
    // Reset additional fields visibility
    setShowAdditionalFields(false);
    setShowDurationField(false);
    setShowQuizTextField(false);
    setShowDisciplineField(false);

    if (!materialType) return;

    // Show appropriate fields based on selection
    if (materialType === "projeto-didatico" || materialType === "sequencia-didatica") {
      setShowDurationField(true);
      setShowAdditionalFields(true);
    }

    if (materialType === "quiz-com-texto") {
      setShowQuizTextField(true);
      setShowAdditionalFields(true);
    }

    if (materialType === "atividade-disciplina") {
      setShowDisciplineField(true);
      setShowAdditionalFields(true);
    }
  }, [materialType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const topic = formData.get("topic") as string;
    const objective = formData.get("objective") as string;
    const audience = formData.get("audience") as string;
    const type = formData.get("materialType") as string;
    const duration = formData.get("duration") as string || "";
    const discipline = formData.get("discipline") as string || "";
    const supportText = formData.get("supportText") as string || "";

    if (!type || !topic || !objective || !audience) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    // BNCC reference
    let bnccReference = "";
    switch (audience) {
      case "educacao-infantil":
        bnccReference = "BNCC: Educação Infantil - Campo de Experiência: Convivência e Participação.";
        break;
      case "ensino-fundamental-i":
        bnccReference = "BNCC: Ensino Fundamental I - Competências Gerais: Pensamento Científico, Crítico e Criativo.";
        break;
      case "ensino-fundamental-ii":
        bnccReference = "BNCC: Ensino Fundamental II - Competências Específicas: Compreensão de Fenômenos Naturais e Sociais.";
        break;
      case "ensino-medio":
        bnccReference = "BNCC: Ensino Médio - Competências: Investigação Científica e Resolução de Problemas.";
        break;
    }

    let prompt = "";
    switch (type) {
      case "plano-de-aula":
        prompt = `Crie um plano de aula sobre o tópico "${topic}" com o objetivo de ${objective} para o público-alvo: ${audience}. Inclua atividades práticas, recursos necessários e sugestões de avaliação. Busque habilidades da BNCC relacionadas ao tópico "${topic}".`;
        break;
      case "projeto-didatico":
        prompt = `Desenvolva um projeto didático sobre o tópico "${topic}" com o objetivo de ${objective} para o público-alvo: ${audience}. O projeto deve ter a duração de ${duration}. Inclua etapas, cronograma, recursos necessários e formas de avaliação. Busque habilidades da BNCC relacionadas ao tópico "${topic}".`;
        break;
      case "sequencia-didatica":
        prompt = `Elabore uma sequência didática sobre o tópico "${topic}" com o objetivo de ${objective} para o público-alvo: ${audience}. A sequência deve ter a duração de ${duration}. Inclua atividades sequenciais, recursos e formas de avaliação. Busque habilidades da BNCC relacionadas ao tópico "${topic}".`;
        break;
      case "atividade-disciplina":
        prompt = `Crie uma atividade para a disciplina de ${discipline} sobre o tópico "${topic}" com o objetivo de ${objective} para o público-alvo: ${audience}. Inclua instruções claras e materiais necessários. Busque habilidades da BNCC relacionadas ao tópico "${topic}".`;
        break;
      case "quiz-com-texto":
        prompt = `Crie um quiz com base no seguinte texto de apoio: "${supportText}". O quiz deve abordar o tópico "${topic}" com o objetivo de ${objective} para o público-alvo: ${audience}. Busque habilidades da BNCC relacionadas ao tópico "${topic}".`;
        break;
      case "quiz-sem-texto":
        prompt = `Crie um quiz sobre o tópico "${topic}" com o objetivo de ${objective} para o público-alvo: ${audience}. Inclua perguntas de múltipla escolha e respostas explicativas. Busque habilidades da BNCC relacionadas ao tópico "${topic}".`;
        break;
    }

    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAtpfi2JJtY6UmuqM8hp7UJGoZNviFT8Uk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Erro ao gerar o material");
      }
      
      const generatedText = data.candidates[0].content.parts[0].text;
      onSubmit(generatedText);
      toast.success("Material gerado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Ocorreu um erro ao gerar o material. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconByMaterialType = (type: string) => {
    switch (type) {
      case "plano-de-aula": return <FileText className="h-4 w-4" />;
      case "projeto-didatico": return <Layers className="h-4 w-4" />;
      case "sequencia-didatica": return <Layout className="h-4 w-4" />;
      case "atividade-disciplina": return <BookOpen className="h-4 w-4" />;
      case "quiz-com-texto": return <FileQuestion className="h-4 w-4" />;
      case "quiz-sem-texto": return <FileQuestion className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="form-control">
        <label htmlFor="materialType" className="form-label flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span>Tipo de Material</span>
        </label>
        <div className="relative">
          <select 
            id="materialType" 
            name="materialType" 
            required
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            className="form-select pr-10"
          >
            <option value="">Selecione uma opção</option>
            <option value="plano-de-aula">Plano de Aula</option>
            <option value="projeto-didatico">Projeto Didático</option>
            <option value="sequencia-didatica">Sequência Didática</option>
            <option value="atividade-disciplina">Atividade para Disciplina</option>
            <option value="quiz-com-texto">Quiz com Texto de Apoio</option>
            <option value="quiz-sem-texto">Quiz sem Texto de Apoio</option>
          </select>
          {materialType && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
              {getIconByMaterialType(materialType)}
            </div>
          )}
        </div>
      </div>

      <div className="form-control">
        <label htmlFor="topic" className="form-label flex items-center gap-2">
          <PenLine className="h-4 w-4 text-primary" />
          <span>Tópico</span>
        </label>
        <input 
          type="text" 
          id="topic" 
          name="topic" 
          placeholder="Ex: Revolução Industrial" 
          required
          className="form-input"
        />
      </div>

      <div className="form-control">
        <label htmlFor="objective" className="form-label flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <span>Objetivo</span>
        </label>
        <textarea 
          id="objective" 
          name="objective" 
          rows={3} 
          placeholder="Ex: Entender os impactos da Revolução Industrial na sociedade moderna" 
          required
          className="form-textarea"
        ></textarea>
      </div>

      <div className="form-control">
        <label htmlFor="audience" className="form-label flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span>Público-Alvo</span>
        </label>
        <select 
          id="audience" 
          name="audience" 
          required
          className="form-select"
        >
          <option value="">Selecione uma opção</option>
          <option value="educacao-infantil">Educação Infantil</option>
          <option value="ensino-fundamental-i">Ensino Fundamental I (1º ao 5º ano)</option>
          <option value="ensino-fundamental-ii">Ensino Fundamental II (6º ao 9º ano)</option>
          <option value="ensino-medio">Ensino Médio</option>
        </select>
      </div>

      {showDurationField && (
        <div className="form-control slide-in-up">
          <label htmlFor="duration" className="form-label flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Duração</span>
          </label>
          <input 
            type="text" 
            id="duration" 
            name="duration" 
            placeholder="Ex: 4 semanas ou 10 aulas"
            className="form-input"
            required
          />
        </div>
      )}

      {showQuizTextField && (
        <div className="form-control slide-in-up">
          <label htmlFor="supportText" className="form-label flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span>Texto de Apoio para o Quiz</span>
          </label>
          <textarea 
            id="supportText" 
            name="supportText" 
            rows={5} 
            placeholder="Insira o texto que servirá como base para o quiz."
            className="form-textarea"
            required
          ></textarea>
        </div>
      )}

      {showDisciplineField && (
        <div className="form-control slide-in-up">
          <label htmlFor="discipline" className="form-label flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Disciplina</span>
          </label>
          <input 
            type="text" 
            id="discipline" 
            name="discipline" 
            placeholder="Ex: História"
            className="form-input"
            required
          />
        </div>
      )}

      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full relative overflow-hidden group py-3 px-6 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            <span>Gerando Material...</span>
          </>
        ) : (
          <>
            <Send className="h-5 w-5 mr-1 group-hover:translate-x-1 transition-transform" />
            <span>Gerar Material</span>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer transition-all"></div>
          </>
        )}
      </button>
    </form>
  );
};

export default MaterialForm;
