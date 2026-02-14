import { FeedbackList } from './FeedbackList';
import { Feedback } from '@/utils/types';

/**
 * FeedbackList Component Examples
 * 
 * Demonstrates different states and use cases of the FeedbackList component.
 */

// Sample feedback data
const sampleFeedback: Feedback[] = [
  {
    id: '1',
    restaurantId: 'rest-1',
    orderId: 'order-12345678',
    customerId: 'customer-1',
    rating: 5,
    comment: 'Amazing food and excellent service! The dishes were fresh and delicious. Will definitely order again.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    restaurantId: 'rest-1',
    orderId: 'order-87654321',
    customerId: 'customer-2',
    dishId: 'dish-1',
    rating: 4,
    comment: 'Great taste but delivery took a bit longer than expected. Overall satisfied with the quality.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    restaurantId: 'rest-1',
    orderId: 'order-11223344',
    customerId: 'customer-3',
    rating: 5,
    comment: 'Perfect! The AR feature helped me choose the right dish. Highly recommend!',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    restaurantId: 'rest-1',
    orderId: 'order-55667788',
    customerId: 'customer-4',
    rating: 3,
    comment: 'Food was okay, but portion sizes could be better for the price.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    restaurantId: 'rest-1',
    orderId: 'order-99887766',
    customerId: 'customer-5',
    rating: 5,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    restaurantId: 'rest-1',
    orderId: 'order-44556677',
    customerId: 'customer-6',
    rating: 2,
    comment: 'Not satisfied with the quality. Expected better based on the photos.',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function FeedbackListExamples() {
  return (
    <div className="space-y-12 p-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">FeedbackList Component Examples</h1>
        <p className="text-muted-foreground">
          Different states and configurations of the FeedbackList component
        </p>
      </div>

      {/* Example 1: With Feedback */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">With Feedback</h2>
          <p className="text-muted-foreground">
            Display list of customer feedback with filtering and sorting options
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <FeedbackList feedback={sampleFeedback} />
        </div>
      </section>

      {/* Example 2: Empty State */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Empty State</h2>
          <p className="text-muted-foreground">
            When there is no feedback available
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <FeedbackList feedback={[]} />
        </div>
      </section>

      {/* Example 3: Loading State */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Loading State</h2>
          <p className="text-muted-foreground">
            Skeleton loading state while fetching feedback
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <FeedbackList feedback={[]} isLoading={true} />
        </div>
      </section>

      {/* Example 4: High Ratings Only */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">High Ratings Only</h2>
          <p className="text-muted-foreground">
            Feedback with 4-5 star ratings
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <FeedbackList
            feedback={sampleFeedback.filter((f) => f.rating >= 4)}
          />
        </div>
      </section>

      {/* Example 5: Low Ratings Only */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Low Ratings Only</h2>
          <p className="text-muted-foreground">
            Feedback with 1-3 star ratings (needs attention)
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <FeedbackList
            feedback={sampleFeedback.filter((f) => f.rating <= 3)}
          />
        </div>
      </section>

      {/* Example 6: Without Comments */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Without Comments</h2>
          <p className="text-muted-foreground">
            Feedback with ratings only (no text comments)
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <FeedbackList
            feedback={sampleFeedback.filter((f) => !f.comment)}
          />
        </div>
      </section>
    </div>
  );
}
