
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
import { useState, useEffect } from 'react';
import { Instagram, CheckCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTaskCounts, updateTaskCount } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const evangelismCategories = ['Interação', 'Conversa', 'Convite'];

export default function TasksPage() {
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initial fetch
    getTaskCounts().then(setTaskCounts);

    // Set up real-time listener
    const unsubscribe = onSnapshot(collection(db, 'task_counts'), (snapshot) => {
      const counts: Record<string, number> = {};
      snapshot.forEach((doc) => {
        counts[doc.id] = doc.data().count || 0;
      });
      setTaskCounts(counts);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleTaskSelect = (task: Task) => {
    if (selectedTasks.length < 10) {
      setSelectedTasks((prev) => [...prev, task]);
      updateTaskCount(task.id, 1);
    }
  };
  
  const handleTaskRemove = (taskToRemove: Task, indexToRemove: number) => {
    setSelectedTasks((prev) => prev.filter((_, index) => index !== indexToRemove));
    updateTaskCount(taskToRemove.id, -1);
  };

  const evangelismTasksCount = selectedTasks.filter(task => evangelismCategories.includes(task.category)).length;
  const freeTasksCount = selectedTasks.length - evangelismTasksCount;

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
      
      {/* Counters and Selected Tasks */}
      <Card className="mb-8 p-6">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-center">
            <div>
                <p className="text-2xl font-bold">{selectedTasks.length}/10</p>
                <p className="text-sm text-muted-foreground">Desafios Escolhidos</p>
            </div>
             <div>
                <p className="text-2xl font-bold">{evangelismTasksCount}/6</p>
                <p className="text-sm text-muted-foreground">Evangelismo</p>
            </div>
             <div>
                <p className="text-2xl font-bold">{freeTasksCount}/4</p>
                <p className="text-sm text-muted-foreground">Livres</p>
            </div>
        </div>
        {selectedTasks.length > 0 && (
          <div className="mt-4">
              <h3 className="text-lg font-semibold text-center mb-2">Sua Lista de Desafios:</h3>
              <ul className="flex flex-wrap justify-center gap-2">
                  {selectedTasks.map((task, index) => (
                      <li key={`${task.id}-${index}`} className="flex items-center gap-2 bg-muted p-2 rounded-md text-sm">
                          <span>{task.description}</span>
                          <button onClick={() => handleTaskRemove(task, index)} className="text-red-500 hover:text-red-700">
                              &times;
                          </button>
                      </li>
                  ))}
              </ul>
          </div>
        )}
      </Card>


      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tasks.map((task) => {
          const Icon = task.icon;
          const count = taskCounts[task.id] || 0;
          return (
            <Card
              key={task.id}
              onClick={() => handleTaskSelect(task)}
              className={cn(
                "flex flex-col justify-between overflow-hidden rounded-lg shadow-lg transition-all duration-300 cursor-pointer relative h-full",
                "hover:scale-105 hover:shadow-xl",
                selectedTasks.length >= 10 && "opacity-60 cursor-not-allowed"
              )}
            >
              <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-base font-semibold">{task.category}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-base font-medium text-foreground/80">{task.description}</p>
                 <div className="flex items-center text-xs text-muted-foreground mt-3">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{count} {count === 1 ? 'pessoa fará' : 'pessoas farão'}</span>
                </div>
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
