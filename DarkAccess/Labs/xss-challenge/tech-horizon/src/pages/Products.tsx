import { Sparkles, BarChart3, Code2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Products = () => {
  const products = [
    {
      icon: Sparkles,
      title: "IA Generativa",
      description: "Potencialize sua empresa com inteligência artificial de última geração",
      features: [
        "Geração automática de conteúdo",
        "Análise preditiva avançada",
        "Chatbots inteligentes",
        "Processamento de linguagem natural",
        "Automação de processos",
        "Integração com sistemas existentes",
      ],
      highlight: "Mais popular",
    },
    {
      icon: BarChart3,
      title: "Dashboards Inteligentes",
      description: "Visualize seus dados de forma clara e tome decisões baseadas em insights",
      features: [
        "Visualização em tempo real",
        "Relatórios customizáveis",
        "Análise de KPIs",
        "Alertas inteligentes",
        "Integração de múltiplas fontes",
        "Exportação de dados",
      ],
      highlight: null,
    },
    {
      icon: Code2,
      title: "Desenvolvimento Web",
      description: "Aplicações web modernas e escaláveis para o seu negócio",
      features: [
        "Design responsivo",
        "Performance otimizada",
        "Segurança avançada",
        "SEO otimizado",
        "Manutenção contínua",
        "Suporte dedicado",
      ],
      highlight: null,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Nossos{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Produtos
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluções tecnológicas completas para impulsionar o crescimento do seu negócio
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={product.title}
                className="relative p-8 rounded-2xl bg-card border border-border shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {product.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium">
                    {product.highlight}
                  </div>
                )}

                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <product.icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="text-2xl font-bold mb-3">{product.title}</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {product.description}
                </p>

                <div className="space-y-3 mb-8">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 group">
                  Saiba mais
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Quer saber mais sobre nossos produtos?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Agende uma demonstração gratuita e veja como nossas soluções podem transformar seu negócio
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Agendar demonstração
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
