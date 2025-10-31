"use client";

import { useState } from "react";
import { getProductRecommendations } from "@/ai/flows/product-recommendations";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface RecommendationsProps {
  productDescription: string;
}

export default function Recommendations({ productDescription }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    try {
      const result = await getProductRecommendations({ productDescription });
      setRecommendations(result.recommendedProducts);
    } catch (e) {
      console.error(e);
      setError("Could not fetch recommendations at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <Button onClick={handleFetchRecommendations} disabled={isLoading} variant="outline" className="w-full">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        Find Similar Products
      </Button>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {recommendations.length > 0 && (
        <div className="mt-4 p-4 border rounded-lg bg-secondary/50">
          <h4 className="font-semibold mb-2 text-secondary-foreground">You might also like:</h4>
          <div className="flex flex-wrap gap-2">
            {recommendations.map((rec, index) => (
              <Badge key={index} variant="secondary">{rec}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
