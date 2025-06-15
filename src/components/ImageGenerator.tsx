
import { useState } from "react";
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
import { Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const models = [
  { id: "TogetherImage/black-forest-labs/FLUX.1-kontext-max", name: "FLUX.1-kontext-max" },
  { id: "TogetherImage/black-forest-labs/FLUX.1.1-pro", name: "FLUX.1.1-pro" },
];

const API_URL = "https://samuraiapi.in/v1/images/generations";
const API_KEY = "896261672367199291725"; // Note: In production, API keys should be handled securely and not exposed on the client-side.

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("A majestic lion wearing a crown, studio lighting, hyperrealistic");
  const [model, setModel] = useState(models[0].id);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) {
      toast.error("Please enter a prompt.");
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
        setImageUrl(data.data[0].url);
        toast.success("Image generated successfully!");
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

  return (
    <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
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
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model" className="w-full text-base h-11">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="text-base">
                    {m.name}
                  </SelectItem>
                ))}
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
      
      <div className="bg-card rounded-lg border p-4 flex items-center justify-center aspect-square">
        {loading && <Skeleton className="h-full w-full rounded-md" />}
        {!loading && !imageUrl && (
          <div className="text-center text-muted-foreground">
            <ImageIcon className="mx-auto h-16 w-16 mb-4" />
            <p className="text-lg">Your generated image will appear here.</p>
          </div>
        )}
        {imageUrl && !loading && (
          <img
            src={imageUrl}
            alt={prompt}
            className="rounded-md object-contain h-full w-full animate-image-pop-in"
          />
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
