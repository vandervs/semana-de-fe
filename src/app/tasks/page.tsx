
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
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Instagram, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TasksPage() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };
  
  return (
    <section className="container py-8 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Desafios de Fé
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Cada estudante deve escolher 10 desafios para cumprir, sendo 6 de evangelismo (categorias: Interação, Conversa, Convite) e 4 livres. O mesmo desafio pode ser escolhido mais de uma vez.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tasks.map((task) => {
          const Icon = task.icon;
          const isSelected = selectedTasks.includes(task.id);
          return (
            <Card
              key={task.id}
              onClick={() => handleTaskSelect(task.id)}
              className={cn(
                "flex flex-col justify-between overflow-hidden rounded-lg shadow-lg transition-all duration-300 cursor-pointer relative h-full",
                "hover:scale-105 hover:shadow-xl",
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}
              <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-base font-semibold">{task.category}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-base font-medium text-foreground/80">{task.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

       {selectedTasks.length > 0 && (
         <div className="mt-12 text-center">
            <Button size="lg" onClick={() => setIsShareModalOpen(true)}>
                <Instagram className="mr-2 h-5 w-5" />
                Compartilhar
            </Button>
         </div>
       )}

      
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle className="text-2xl text-center">Compartilhe no Instagram!</DialogTitle>
                <DialogDescription className="text-center pt-4">
                    Tire um print desta tela com seus desafios selecionados e poste nos seus Stories!
                </DialogDescription>
            </DialogHeader>
            <div className="text-center p-4 rounded-lg bg-muted">
                <p className="font-bold text-lg">Não se esqueça de usar a hashtag:</p>
                <p className="text-2xl font-bold text-primary mt-2">#semanadefe</p>
            </div>
        </DialogContent>
      </Dialog>
      
    </section>
  );
}
