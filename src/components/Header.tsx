
import { Link } from 'react-router-dom';
import AuthDialog from '@/components/auth/AuthDialog';
import { useAuth } from '@/hooks/useAuth';
import { UserNav } from '@/components/UserNav';
import { Button } from './ui/button';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold">At41rv-Img</Link>
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="link" asChild>
                <Link to="/community">Community</Link>
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {loading ? null : user ? <UserNav /> : <AuthDialog />}
        </div>
      </div>
    </header>
  );
}
