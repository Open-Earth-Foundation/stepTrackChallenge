import React, { useEffect, useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { db, auth } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { useForm } from "react-hook-form";

export interface StepEntry {
    id: number;
    userId: string;
    challengeId: number;
    date: string;
    steps: number;
    username: string;
}


export default function StepEntryForm() {
    const [user, setUser] = useState<User | null>(null);
    const form = useForm<StepEntry>({
        defaultValues: {
            date: new Date().toISOString().slice(0, 10),
            steps: 0,
        },
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return unsubscribe;
    }, []);

    const onSubmit = async (data: StepEntry) => {
        if (!user) {
            alert("You must be logged in to submit steps.");
            return;
        }
        try {
            await addDoc(collection(db, "steps"), {
                userId: user.uid,
                date: data.date,
                steps: parseInt(data.steps as unknown as string),
                createdAt: new Date(),
                username: user.displayName,
            });
            form.reset();
            alert("Steps submitted!");
        } catch (e) {
            alert("Error submitting steps: " + (e as Error).message);
        }
    };

    if (!user) {
        return <div>Please log in to enter your steps.</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <Form {...form}>
                <h3 className="text-xl font-heading font-bold text-neutral-800 mb-4">Submit your steps</h3>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="steps"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Steps</FormLabel>
                                <FormControl>
                                    <Input type="number" min={0} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit Steps</Button>
                </form>
            </Form>
        </div>
    );
}