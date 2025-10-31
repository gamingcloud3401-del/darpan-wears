# **App Name**: eCommerce Simplified

## Core Features:

- Firebase Integration: Utilize Firebase Firestore for data storage.
- Data Migration: Seed the Firestore 'products' collection with initial data from the existing array, only if the collection is empty.
- Real-time Product Updates: Implement real-time updates to the product list using Firestore's onSnapshot listener.
- Order Now Button: Replaces confirmation modal with a direct 'Order Now' button in the Product Detail Modal that triggers the order form if a size is selected.
- Admin Login: The adminLogin now sets the isAdminLoggedIn flag in sessionStorage.
- Product Removal: Implement the product removal logic to delete the document from the Firestore products collection
- Dynamic Recommendations: AI tool to recommend similar products to the user based on item details.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5), evoking feelings of trust and reliability suitable for e-commerce.
- Background color: Very light gray (#F0F2F5), providing a clean, non-distracting backdrop.
- Accent color: Violet (#9C27B0), for highlighting key interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a clean and modern user experience.
- Simple, clear icons for navigation and product categories.
- Clean, card-based layout for products, with clear call-to-action buttons.
- Subtle transitions and loading animations to enhance user experience.