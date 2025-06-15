
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Profile() {
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [loading, user, navigate]);

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
    if (name) return name.substring(0, 2).toUpperCase();
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? "User"} />
                        <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-3xl">{user.displayName ?? 'User'}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                   <div>
                        <h3 className="font-semibold text-muted-foreground">Subscription</h3>
                        <p className={`font-bold capitalize text-lg ${userData.subscription === 'ultimate' ? 'text-primary' : ''}`}>{userData.subscription}</p>
                   </div>
                   <div>
                        <h3 className="font-semibold text-muted-foreground">Role</h3>
                        <p className="capitalize text-lg">{userData.role}</p>
                   </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
