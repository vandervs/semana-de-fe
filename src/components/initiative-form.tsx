"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MessageCircle, BookOpen, UserCheck } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const formSchema = z.object({
  locationName: z.string().min(3, { message: "Location must be at least 3 characters." }),
  evangelizedName: z.string().min(2, { message: "Person's name must be at least 2 characters." }),
  evangelistName: z.string().min(2, { message: "Your name must be at least 2 characters." }),
  testimony: z.string().min(20, { message: "Testimony must be at least 20 characters." }).max(500, { message: "Testimony cannot exceed 500 characters."}),
  interactionType: z.enum(["conversation", "presentation", "acceptance"], { required_error: "You need to select an interaction type." }),
  photo: z.any().optional(), // In a real app, you would validate this file
});

export function InitiativeForm() {
    const [isSuccess, setIsSuccess] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            locationName: "",
            evangelizedName: "",
            evangelistName: "",
            testimony: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // In a real app, you'd call a server action here.
        console.log("Form submitted:", values);
        
        setIsSuccess(true);
        form.reset();

        setTimeout(() => {
            setIsSuccess(false);
        }, 5000);
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Share Your Story</CardTitle>
                <CardDescription>Fill out the form below to add an initiative to the map.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="evangelistName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., João" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="evangelizedName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Person's Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Maria" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="locationName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., São Paulo, SP" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Please provide the city and state.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="testimony"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Testimony</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Share a brief testimony of how it went..."
                                            className="resize-none"
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="interactionType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Type of Interaction</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col md:flex-row gap-4 pt-2"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="conversation" />
                                                </FormControl>
                                                <FormLabel className="font-normal flex items-center">
                                                    <MessageCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                                                    Spiritual Conversation
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="presentation" />
                                                </FormControl>
                                                <FormLabel className="font-normal flex items-center">
                                                    <BookOpen className="mr-2 h-5 w-5 text-muted-foreground" />
                                                    Gospel Presentation
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="acceptance" />
                                                </FormControl>
                                                <FormLabel className="font-normal flex items-center">
                                                    <UserCheck className="mr-2 h-5 w-5 text-muted-foreground" />
                                                    Accepted Christ
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="photo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Photo (Optional)</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormDescription>
                                        A picture of the moment or place.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {isSuccess && (
                            <div className="rounded-md border border-green-500/20 bg-green-500/10 p-4 flex items-center gap-3 text-sm text-green-800 dark:text-green-200">
                                <CheckCircle className="h-5 w-5"/>
                                <p>Thank you for your submission! It will appear on the map shortly.</p>
                            </div>
                        )}

                        <Button type="submit" size="lg" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                           {form.formState.isSubmitting ? 'Submitting...' : 'Submit to Map'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
