'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending products similar to a given product.
 *
 * The flow takes a product description as input and returns a list of recommended product names.
 *
 * @interface ProductRecommendationsInput - Input schema for the product recommendation flow.
 * @interface ProductRecommendationsOutput - Output schema for the product recommendation flow.
 * @function getProductRecommendations - The exported function that triggers the product recommendation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  productDescription: z.string().describe('The description of the product for which to generate recommendations.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z.array(z.string()).describe('A list of recommended product names.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const productRecommendationsPrompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are a product recommendation expert. Given the following product description, recommend a list of similar products.

Product Description: {{{productDescription}}}

Recommended Products:`, 
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationsPrompt(input);
    return output!;
  }
);
