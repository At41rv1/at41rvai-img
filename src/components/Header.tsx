
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold">Flux AI</span>
        </div>
        <nav className="flex items-center gap-2">
          <Button variant="ghost">Login</Button>
          <Button>Sign Up</Button>
        </nav>
      </div>
    </header>
  );
}
