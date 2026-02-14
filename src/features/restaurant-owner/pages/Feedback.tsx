import { useState } from 'react';
import { Star, TrendingUp, MessageSquare, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FeedbackList } from '../components/FeedbackList';
import { Feedback } from '@/utils/types';

/**
 * Feedback Page Component
 * 
 * Displays customer feedback and ratings for the restaurant.
 * 
 * Features:
 * - Overview statistics (average rating, total feedback, response rate)
 * - Filterable and sortable feedback list
 * - Individual feedback cards with ratings and comments
 * - Empty state for no feedback
 * 
 * @component
 */
export function FeedbackPage() {
  // Mock data - In production, this would come from API/database
  const [feedback] = useState<Feedback[]>([
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
  ]);

  // Calculate statistics
  const averageRating = feedback.length > 0
    ? (feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1)
    : '0.0';

  const totalFeedback = feedback.length;

  const feedbackWithComments = feedback.filter((item) => item.comment).length;
  const responseRate = totalFeedback > 0
    ? Math.round((feedbackWithComments / totalFeedback) * 100)
    : 0;

  const recentFeedback = feedback.filter(
    (item) => new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customer Feedback</h1>
        <p className="text-muted-foreground mt-2">
          View and analyze customer ratings and reviews
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Out of 5.0 stars
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeedback}</div>
            <p className="text-xs text-muted-foreground">
              All time reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comment Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              Customers leaving comments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Feedback</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentFeedback}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Breakdown of customer ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = feedback.filter((item) => item.rating === rating).length;
              const percentage = totalFeedback > 0 ? (count / totalFeedback) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>All Feedback</CardTitle>
          <CardDescription>Customer reviews and ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackList feedback={feedback} />
        </CardContent>
      </Card>
    </div>
  );
}
