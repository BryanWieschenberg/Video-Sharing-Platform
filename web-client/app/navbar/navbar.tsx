import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav>
            <Link href="/">
                <Image width={150} height={150} src="/logo.svg" alt="Logo" />
            </Link>
        </nav>
    );
}
