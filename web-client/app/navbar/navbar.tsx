'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './navbar.module.css';
import SignIn from './sign-in';
import { onAuthChangedHelper } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

export default function Navbar() {
    // Init user state
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        const unsubscribe = onAuthChangedHelper((user) => {
            setUser(user);
        })

        // Cleanup subscription on unmount
        return () => unsubscribe();
    });

    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image width={50} height={50}
                    src="/logo.svg" alt="Logo" />
            </Link>
            {
                // TODO: Add an upload
            }
            <SignIn user={user} />
        </nav>
    );
}
