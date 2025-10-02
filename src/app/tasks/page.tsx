
'use client';

import { tasks, type Task } from '@/lib/tasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Instagram, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { incrementTaskCount, getTaskCounts } from '@/lib/data';

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCounts() {
      const counts = await getTaskCounts();
      setTaskCounts(counts);
    }
    fetchCounts();
  }, []);

  const handleShareClick = async (task: Task) => {
    try {
      await incrementTaskCount(task.id);
      setTaskCounts((prevCounts) => ({
        ...prevCounts,
        [task.id]: (prevCounts[task.id] || 0) + 1,
      }));
      setSelectedTask(task);
    } catch (error) {
      console.error('Error incrementing task count:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível registrar a seleção. Tente novamente.',
      });
    }
  };

  const handleCopyToClipboard = () => {
    if (!selectedTask) return;
    const shareText = `Desafio da Semana de Fé: ${selectedTask.description} #semanadefe`;
    navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
     toast({
        title: "Copiado!",
        description: "O texto do desafio foi copiado. Agora cole nos seus Stories!",
    });
  };

  return (
    <section className="container py-8 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Desafios de Fé
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Escolha um desafio, aceite-o e compartilhe com seus amigos para espalhar o movimento!
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tasks.map((task) => {
          const Icon = task.icon;
          return (
            <Card
              key={task.id}
              className="flex flex-col justify-between overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">{task.category}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-lg font-medium text-foreground/80">{task.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button className="w-full" onClick={() => handleShareClick(task)}>
                  <Instagram className="mr-2 h-4 w-4" /> Compartilhar
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">Compartilhe seu Desafio!</DialogTitle>
              <DialogDescription>
                Copie o texto abaixo e compartilhe nos seus Stories do Instagram para inspirar outros.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 rounded-lg border bg-muted p-4">
                <p className="text-lg font-semibold text-center">
                    {selectedTask.description}
                </p>
                <p className="text-center text-sm text-muted-foreground mt-2">#semanadefe</p>
            </div>
            <p className="text-center text-sm text-muted-foreground">
                Este desafio já foi aceito <span className="font-bold text-primary">{taskCounts[selectedTask.id] || 1}</span> vezes!
            </p>
            <DialogFooter className="sm:justify-center pt-4">
              <Button onClick={handleCopyToClipboard} size="lg">
                {isCopied ? (
                    <>
                        <Check className="mr-2 h-5 w-5" /> Copiado
                    </>
                ) : (
                    <>
                        <Copy className="mr-2 h-5 w-5" /> Copiar Texto
                    </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

