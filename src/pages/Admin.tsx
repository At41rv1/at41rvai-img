
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { UserData } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Image {
  id: string;
  prompt: string;
  imageUrl: string;
  authorEmail: string;
}

export default function Admin() {
  const { userData, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [emailToUpgrade, setEmailToUpgrade] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (!loading && userData?.role !== 'admin') {
      navigate('/');
    }
    if (userData?.role === 'admin') {
      const fetchAllData = async () => {
        // Fetch users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setUsers(usersSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }) as UserData));

        // Fetch images
        const imagesSnapshot = await getDocs(collection(db, 'images'));
        setImages(imagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Image[]);
      };
      fetchAllData();
    }
  }, [userData, loading, navigate]);
  
  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToUpgrade) return;
    setIsUpgrading(true);
    
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", emailToUpgrade));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            toast.error("User not found with that email.");
            return;
        }

        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), {
            subscription: 'ultimate'
        });

        toast.success(`Successfully upgraded ${emailToUpgrade} to Ultimate!`);
        setEmailToUpgrade('');
        // Refresh user list
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setUsers(usersSnapshot.docs.map(d => ({ ...d.data(), uid: d.id }) as UserData));
    } catch (error: any) {
        toast.error("Failed to upgrade user.", { description: error.message });
    } finally {
        setIsUpgrading(false);
    }
  };


  if (loading || userData?.role !== 'admin') {
    return <div>Loading...</div>; // Or a proper loader
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-4xl md:text-5xl font-black text-foreground pb-8">Admin Panel</h1>
        <div className="grid gap-8 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Grant Ultimate Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpgrade} className="space-y-4">
                        <Input 
                            type="email"
                            placeholder="user@example.com"
                            value={emailToUpgrade}
                            onChange={(e) => setEmailToUpgrade(e.target.value)}
                        />
                        <Button type="submit" disabled={isUpgrading}>
                            {isUpgrading ? 'Upgrading...' : 'Upgrade User'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                   <ul className="space-y-2">
                       {users.map(user => (
                           <li key={user.uid} className="flex justify-between items-center text-sm p-2 bg-secondary rounded">
                               <span>{user.email}</span>
                               <span className={`font-bold ${user.subscription === 'ultimate' ? 'text-primary' : 'text-muted-foreground'}`}>{user.subscription}</span>
                           </li>
                       ))}
                   </ul>
                </CardContent>
            </Card>
        </div>
        <div className="mt-8">
             <Card>
                <CardHeader>
                    <CardTitle>All Generated Images ({images.length})</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[50vh] overflow-y-auto">
                    {images.map(image => (
                        <div key={image.id} className="group relative">
                             <img src={image.imageUrl} alt={image.prompt} className="w-full h-auto object-cover rounded-lg" />
                             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs font-bold truncate">{image.prompt}</p>
                                <p className="text-gray-300 text-[10px]">by {image.authorEmail}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  )
}
