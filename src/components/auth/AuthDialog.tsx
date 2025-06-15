
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { Chrome } from "lucide-react";

const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const handleGoogleSignIn = async (onOpenChange: (open: boolean) => void) => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
            });
        }
        toast.success("Successfully signed in with Google!");
        onOpenChange(false);
    } catch (error: any) {
        toast.error("Google Sign-In Failed", { description: error.message });
    }
};

function SignUpForm({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
      });
      toast.success("Account created successfully!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Sign Up Failed", { description: error.message });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input placeholder="name@example.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full">Create Account</Button>
      </form>
    </Form>
  );
}

function LoginForm({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast.success("Logged in successfully!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Login Failed", { description: error.message });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input placeholder="name@example.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </Form>
  );
}


export default function AuthDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue="login" className="w-full">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-center">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </DialogTitle>
          </DialogHeader>
          <TabsContent value="login">
            <LoginForm onOpenChange={setOpen} />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm onOpenChange={setOpen} />
          </TabsContent>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
           <Button variant="outline" className="w-full" onClick={() => handleGoogleSignIn(setOpen)}>
             <Chrome className="mr-2 h-4 w-4" />
             Google
           </Button>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
