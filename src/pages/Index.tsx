
import ImageGenerator from "@/components/ImageGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500 pb-2">
            Flux AI Image Generation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-2">
            Bring your imagination to life with state-of-the-art AI models.
          </p>
        </div>
        <ImageGenerator />
      </main>
      <footer className="text-center py-6 text-muted-foreground text-sm">
        <p>Powered by <a href="https://samuraiapi.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Samurai API</a>. Built with Lovable.</p>
      </footer>
    </div>
  );
};

export default Index;
