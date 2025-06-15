
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';

export default function Profile() {
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [loading, user, navigate]);

  const handleLogout = () => {
    signOut(auth);
    navigate('/');
  };

  if (loading || !user || !userData) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }
  
  const getInitials = (email: string | null) => {
    if (!email) return "U";
    const name = user?.displayName;
    if (name) {
      const parts = name.split(' ');
      if (parts.length > 1 && parts[parts.length - 1]) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-muted/40 font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary/20">
                        <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? "User"} />
                        <AvatarFallback className="text-3xl">{getInitials(user.email)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl">{user.displayName ?? 'User'}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                   <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-semibold text-muted-foreground">Subscription</h3>
                        <Badge variant={userData.subscription === 'ultimate' ? 'default' : 'secondary'} className="capitalize text-lg">
                          {userData.subscription}
                        </Badge>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-semibold text-muted-foreground">Role</h3>
                        <p className="capitalize font-semibold text-lg">{userData.role}</p>
                   </div>
                   
                   {userData.role === 'admin' && (
                     <Button asChild className="w-full">
                       <Link to="/admin">
                         <ShieldCheck className="mr-2 h-4 w-4" />
                         Admin Panel
                       </Link>
                     </Button>
                   )}

                   <Button onClick={handleLogout} variant="outline" className="w-full">
                     <LogOut className="mr-2 h-4 w-4" />
                     Logout
                   </Button>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
