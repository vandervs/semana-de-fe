
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
import { useState, useRef, useCallback } from 'react';
import { Instagram, Download, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import * as htmlToImage from 'html-to-image';
import Image from 'next/image';

export default function TasksPage() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();
  const shareableImageRef = useRef<HTMLDivElement>(null);

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };
  
  const getTaskById = (id: string) => tasks.find(task => task.id === id);

  const handleDownloadImage = useCallback(() => {
    if (!shareableImageRef.current) return;
    setIsGeneratingImage(true);

    htmlToImage.toPng(shareableImageRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'meus-desafios-semana-de-fe.png';
        link.href = dataUrl;
        link.click();
        toast({
            title: "Imagem Baixada!",
            description: "Sua imagem de desafios está pronta para ser compartilhada.",
        });
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
        toast({
            variant: "destructive",
            title: "Erro ao gerar imagem",
            description: "Não foi possível criar sua imagem. Tente novamente.",
        });
      })
      .finally(() => {
        setIsGeneratingImage(false);
        setIsShareModalOpen(false);
      });
  }, [toast]);


  return (
    <section className="container py-8 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Desafios de Fé
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Selecione os desafios que você completou esta semana e compartilhe sua jornada para inspirar outros!
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tasks.map((task) => {
          const Icon = task.icon;
          const isSelected = selectedTasks.includes(task.id);
          return (
            <Card
              key={task.id}
              onClick={() => handleTaskSelect(task.id)}
              className={cn(
                "flex flex-col justify-between overflow-hidden rounded-lg shadow-lg transition-all duration-300 cursor-pointer relative",
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
                <CardTitle className="text-lg font-semibold">{task.category}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-lg font-medium text-foreground/80">{task.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

       {selectedTasks.length > 0 && (
         <div className="mt-12 text-center">
            <Button size="lg" onClick={() => setIsShareModalOpen(true)}>
                <Instagram className="mr-2 h-5 w-5" />
                Gerar Imagem para Compartilhar
            </Button>
         </div>
       )}

      
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="max-w-xl">
            <DialogHeader>
            <DialogTitle className="text-2xl text-center">Compartilhe seus Desafios!</DialogTitle>
            <DialogDescription className="text-center">
                Sua imagem está pronta. Baixe-a e compartilhe nos seus Stories do Instagram para inspirar outros.
            </DialogDescription>
            </DialogHeader>
            
            <div 
              ref={shareableImageRef} 
              className="my-4 rounded-lg border bg-card p-6"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <Image src="/logo-cru.png" alt="Logo Cru" width={60} height={60} />
                <h2 className="text-2xl font-bold mt-2">Desafios de Fé Cumpridos!</h2>
                <p className="text-muted-foreground">Participei da Semana de Fé e completei estes desafios.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {selectedTasks.map(taskId => {
                    const task = getTaskById(taskId);
                    if (!task) return null;
                    const Icon = task.icon;
                    return (
                        <div key={taskId} className="flex items-center gap-4 rounded-md border p-3 bg-background">
                            <Icon className="h-5 w-5 text-primary shrink-0" />
                            <p className="text-base font-medium">{task.description}</p>
                        </div>
                    )
                })}
              </div>
               <p className="text-center text-lg font-bold text-primary mt-6">#semanadefe</p>
            </div>

            <DialogFooter className="sm:justify-center pt-4">
            <Button onClick={handleDownloadImage} size="lg" disabled={isGeneratingImage}>
              {isGeneratingImage ? 'Gerando...' : (
                <>
                  <Download className="mr-2 h-5 w-5" /> Baixar Imagem
                </>
              )}
            </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </section>
  );
}
