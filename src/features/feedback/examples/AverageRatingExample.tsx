import { AverageRating } from '../components/AverageRating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Example usage of the AverageRating component
 * This demonstrates various ways to display average ratings in your application
 */

// Mock data
const mockDish = {
  id: '1',
  name: 'Margherita Pizza',
  description: 'Classic Italian pizza with fresh mozzarella and basil',
  price: 12.99,
  averageRating: 4.5,
  reviewCount: 127,
};

const mockRestaurant = {
  id: '1',
  name: 'Bella Italia',
  averageRating: 4.8,
  totalReviews: 1543,
};

export function AverageRatingExample() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">AverageRating Component Examples</h1>

      {/* Example 1: Dish Card */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Dish Card (Horizontal Layout)</h2>
        <Card>
          <CardHeader>
            <CardTitle>{mockDish.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{mockDish.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${mockDish.price}</span>
              <AverageRating
                averageRating={mockDish.averageRating}
                reviewCount={mockDish.reviewCount}
                size="sm"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Example 2: Restaurant Header */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Restaurant Header (Large Size)</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">🍕</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{mockRestaurant.name}</h3>
                <AverageRating
                  averageRating={mockRestaurant.averageRating}
                  reviewCount={mockRestaurant.totalReviews}
                  size="lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Example 3: Compact Display */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Compact Display (No Label)</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="font-medium">Quick Rating View</span>
              <AverageRating
                averageRating={4.2}
                reviewCount={45}
                size="sm"
                showLabel={false}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Example 4: Vertical Layout */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Vertical Layout</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'Pasta Carbonara', rating: 4.7, reviews: 89 },
            { name: 'Caesar Salad', rating: 4.3, reviews: 56 },
            { name: 'Tiramisu', rating: 4.9, reviews: 134 },
          ].map((item) => (
            <Card key={item.name}>
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold mb-4">{item.name}</h3>
                <AverageRating
                  averageRating={item.rating}
                  reviewCount={item.reviews}
                  layout="vertical"
                  size="md"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Example 5: Minimal (Stars Only) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Minimal Display (Stars Only)</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Food Quality</span>
                <AverageRating
                  averageRating={4.5}
                  reviewCount={100}
                  showLabel={false}
                  showCount={false}
                  size="sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Service</span>
                <AverageRating
                  averageRating={4.8}
                  reviewCount={100}
                  showLabel={false}
                  showCount={false}
                  size="sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Ambiance</span>
                <AverageRating
                  averageRating={4.3}
                  reviewCount={100}
                  showLabel={false}
                  showCount={false}
                  size="sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Example 6: Different Ratings */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Various Rating Scenarios</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Perfect Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <AverageRating averageRating={5.0} reviewCount={50} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">New Item (Few Reviews)</CardTitle>
            </CardHeader>
            <CardContent>
              <AverageRating averageRating={4.0} reviewCount={3} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">No Reviews Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <AverageRating averageRating={0} reviewCount={0} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Popular Item</CardTitle>
            </CardHeader>
            <CardContent>
              <AverageRating averageRating={4.6} reviewCount={2847} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
