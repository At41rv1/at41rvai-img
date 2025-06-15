
import ImageGenerator from "@/components/ImageGenerator";
import Header from "@/components/Header";
import Pricing from "@/components/Pricing";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-foreground pb-2">
            At41rv-Img Generation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-2">
            Bring your imagination to life with state-of-the-art AI models.
          </p>
        </div>
        <ImageGenerator />
        <Pricing />
      </main>
      <footer className="text-center py-6 text-muted-foreground text-sm">
        <p>Powered by <a href="https://www.instagram.com/at41rv" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">At41rv-Img</a>. Built with Lovable.</p>
      </footer>
    </div>
  );
};

export default Index;
