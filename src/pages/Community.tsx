
import Header from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface Image {
  id: string;
  prompt: string;
  imageUrl: string;
  authorEmail: string;
}

const fetchImages = async (): Promise<Image[]> => {
  const imagesCollectionRef = collection(db, "images");
  const q = query(imagesCollectionRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Image[];
};

export default function Community() {
  const { data: images, isLoading, isError } = useQuery({
    queryKey: ["communityImages"],
    queryFn: fetchImages,
  });
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-foreground pb-2">
            Community Gallery
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-2">
            Explore images created by the Flux AI community.
          </p>
        </div>
        
        <div>
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {isError && (
             <p className="text-center text-destructive">Failed to load images. Please try again later.</p>
          )}

          {!isLoading && !isError && images && images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="group relative animate-image-pop-in">
                  <img src={image.imageUrl} alt={image.prompt} className="w-full h-auto object-cover rounded-lg" />
                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-bold truncate">{image.prompt}</p>
                      <p className="text-gray-300 text-xs">by {image.authorEmail}</p>
                    </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !isError && (!images || images.length === 0) && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-foreground">No Images Yet</h2>
              <p className="text-muted-foreground mt-2">Be the first to create and share an image!</p>
            </div>
          )}
        </div>

      </main>
      <footer className="text-center py-6 text-muted-foreground text-sm">
        <p>Powered by <a href="https://samuraiapi.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Samurai API</a>. Built with Lovable.</p>
      </footer>
    </div>
  );
}
