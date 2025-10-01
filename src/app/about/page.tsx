
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Target, Map, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <section className="container py-8 md:py-12">
            <div className="mx-auto max-w-3xl">
                <div className="space-y-4 text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                        Sobre a Semana de Fé
                    </h1>
                    <p className="text-muted-foreground md:text-xl">
                        Uma iniciativa de evangelismo da Cru para espalhar a esperança no Sudeste do Brasil.
                    </p>
                </div>

                <div className="grid gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-6 w-6 text-primary" />
                                Nossa Missão
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-lg text-foreground/80">
                            <p>
                                A Semana de Fé é uma iniciativa de evangelismo da Cru que ocorrerá durante duas semanas no mês de outubro. Nosso objetivo é claro: alcançar 3.000 pessoas com a mensagem do evangelho, mobilizando aproximadamente 500 estudantes de nossos movimentos. Cada estudante terá a meta de evangelizar 10 pessoas ao longo das duas semanas.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-6 w-6 text-primary" />
                                    Período da Iniciativa
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="font-semibold text-lg">Início: <span className="font-normal text-muted-foreground">06 de Outubro de 2025</span></p>
                                <p className="font-semibold text-lg">Término: <span className="font-normal text-muted-foreground">17 de Outubro de 2025</span></p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-6 w-6 text-primary" />
                                    Objetivos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-lg"><span className="font-bold">500</span> estudantes mobilizados</p>
                                <p className="text-lg"><span className="font-bold">3.000</span> pessoas alcançadas</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Map className="h-6 w-6 text-primary" />
                                Localização e Ferramentas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-lg text-foreground/80">
                            <p>
                                Cada iniciativa será informada através deste site dedicado. Ele serve como um centro de informações e registro, onde são inseridos os detalhes e contatos das interações evangelísticas. Além disso, o mapa interativo na página inicial mostra o impacto gerado em tempo real, visualizando as áreas alcançadas e o progresso em relação ao nosso objetivo.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
