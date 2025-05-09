import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { Button } from "./ui/button";

export default function AuthWidget() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return unsubscribe;
    }, []);

    const handleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (e) {
            alert("Sign in failed: " + (e as Error).message);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (e) {
            alert("Sign out failed: " + (e as Error).message);
        }
    };

    if (user) {
        return (
            <div className="flex items-center gap-4">
                {user.photoURL && (
                    <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full" />
                )}
                <span>{user.displayName || user.email}</span>
                <Button variant="outline" onClick={handleSignOut}>
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <Button onClick={handleSignIn}>
            Sign in with Google
        </Button>
    );
}