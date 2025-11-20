import { Building2, Handshake, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Partners = () => {
  const stats = [
    { label: "Clientes Ativos", value: "150+", icon: Users },
    { label: "Projetos Entregues", value: "500+", icon: TrendingUp },
    { label: "Anos de Experiência", value: "10+", icon: Building2 },
    { label: "Taxa de Satisfação", value: "98%", icon: Handshake },
  ];

  const partners = [
    {
      name: "TechCorp Solutions",
      sector: "Tecnologia",
      description: "Transformação digital completa com implementação de IA generativa e dashboards analíticos.",
    },
    {
      name: "FinanceHub",
      sector: "Financeiro",
      description: "Desenvolvimento de plataforma web para gestão financeira com integração de múltiplos sistemas.",
    },
    {
      name: "RetailMax",
      sector: "Varejo",
      description: "Dashboards inteligentes para análise de vendas e gestão de estoque em tempo real.",
    },
    {
      name: "HealthTech Pro",
      sector: "Saúde",
      description: "Sistema de IA para análise de dados médicos e suporte à decisão clínica.",
    },
    {
      name: "EduPlatform",
      sector: "Educação",
      description: "Plataforma educacional com IA generativa para personalização de conteúdo.",
    },
    {
      name: "LogiChain",
      sector: "Logística",
      description: "Sistema web de rastreamento e otimização de rotas com dashboards preditivos.",
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
              Parceiros
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empresas que confiam em nossas soluções para transformar seus negócios
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl bg-card border border-border shadow-card text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Casos de Sucesso</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-5 duration-700"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                    {partner.sector}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Seja nosso próximo parceiro
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Junte-se às empresas que já transformaram seus negócios com nossas soluções
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Fale conosco
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
