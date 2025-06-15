
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon, Download } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const models = [
  { id: "TogetherImage/black-forest-labs/FLUX.1-kontext-max", name: "At41rv Ultimate" },
  { id: "TogetherImage/black-forest-labs/FLUX.1.1-pro", name: "At41rv Pro" },
];

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_AI;

const ImageGenerator = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [prompt, setPrompt] = useState("A majestic lion wearing a crown, studio lighting, hyperrealistic");
  const [model, setModel] = useState(models[1].id);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) {
      toast.error("Please enter a prompt.");
      return;
    }

    if (model === models[0].id && !user) {
        toast.error("Please log in to use the Ultimate model.", {
            description: "Only logged-in users can use this model.",
        });
        return;
    }

    if (!user && localStorage.getItem("hasGeneratedOnce")) {
      toast.error("Please log in to generate more images.", {
        description: "You get one free generation. Sign in to continue.",
      });
      return;
    }

    setLoading(true);
    setImageUrl(null);
    console.log(`Generating image with model: ${model}`);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": API_KEY,
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
        }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        throw new Error(data.message || "Failed to generate image.");
      }

      if (data && data.data && data.data.length > 0 && data.data[0].url) {
        const newImageUrl = data.data[0].url;
        setImageUrl(newImageUrl);
        toast.success("Image generated successfully!");

        if (user) {
          await addDoc(collection(db, "images"), {
            prompt,
            imageUrl: newImageUrl,
            authorEmail: user.email,
            authorId: user.uid,
            createdAt: serverTimestamp(),
            modelName: models.find(m => m.id === model)?.name || model,
          });
          queryClient.invalidateQueries({ queryKey: ["communityImages"] });
        } else {
          localStorage.setItem("hasGeneratedOnce", "true");
        }
      } else {
        console.error("Unexpected API response structure:", data);
        throw new Error("Could not find image URL in the response.");
      }
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (newModel: string) => {
    if (newModel === models[0].id && !user) {
        toast.error("Please log in to use the Ultimate model.");
        return;
    }
    setModel(newModel);
  }

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const filename =
        (
          prompt
            .substring(0, 30)
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase() || "generated-image"
        ) + ".png";
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast.success("Image download started.");
    } catch (error) {
      console.error("Download failed", error);
      toast.error("Failed to download image.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-2">
      <div className="space-y-6 relative">
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card rounded-lg border">
          <div className="space-y-2">
            <label htmlFor="prompt" className="font-semibold text-lg">Your Prompt</label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A majestic lion wearing a crown..."
              className="min-h-[120px] text-base"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="model" className="font-semibold text-lg">Choose a Model</label>
            <Select value={model} onValueChange={handleModelChange}>
              <SelectTrigger id="model" className="w-full text-base h-11">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={models[1].id} value={models[1].id} className="text-base">
                  {models[1].name}
                </SelectItem>
                <SelectItem 
                    key={models[0].id} 
                    value={models[0].id} 
                    className="text-base"
                >
                    {models[0].name} {!user && <span className="text-muted-foreground ml-2">(Login to use)</span>}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-bold">
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Image'
            )}
          </Button>
        </form>
      </div>
      
      <div className="bg-card rounded-lg border p-4 flex items-center justify-center aspect-square relative">
        {loading && <Skeleton className="h-full w-full rounded-md" />}
        {!loading && !imageUrl && (
          <div className="text-center text-muted-foreground">
            <ImageIcon className="mx-auto h-16 w-16 mb-4" />
            <p className="text-lg">Your generated image will appear here.</p>
          </div>
        )}
        {imageUrl && !loading && (
          <>
            <img
              src={imageUrl}
              alt={prompt}
              className="rounded-md object-contain h-full w-full animate-image-pop-in"
            />
            <Button
              onClick={handleDownload}
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 h-10 w-10 bg-black/50 hover:bg-black/75 text-white"
            >
              <Download className="h-5 w-5" />
              <span className="sr-only">Download image</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
