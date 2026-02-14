import { useState } from 'react';
import { Star, MessageSquare, Calendar, User, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Feedback } from '@/utils/types';
import { cn } from '@/lib/utils';

interface FeedbackListProps {
  feedback: Feedback[];
  isLoading?: boolean;
}

export function FeedbackList({ feedback, isLoading }: FeedbackListProps) {
  const [filterRating, setFilterRating] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

  // Filter feedback by rating
  const filteredFeedback = feedback.filter((item) => {
    if (filterRating === 'all') return true;
    return item.rating === parseInt(filterRating);
  });

  // Sort feedback
  const sortedFeedback = [...filteredFeedback].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.rating - a.rating;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-3 bg-muted rounded w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No feedback yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Customer feedback will appear here once orders are completed
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by rating:</span>
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort by:</span>
          <Button
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('recent')}
          >
            Most Recent
          </Button>
          <Button
            variant={sortBy === 'rating' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('rating')}
          >
            Highest Rating
          </Button>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {sortedFeedback.map((item) => (
          <FeedbackCard key={item.id} feedback={item} />
        ))}
      </div>

      {filteredFeedback.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground">No feedback matches the selected filter</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface FeedbackCardProps {
  feedback: Feedback;
}

function FeedbackCard({ feedback }: FeedbackCardProps) {
  const ratingColor = getRatingColor(feedback.rating);
  const formattedDate = new Date(feedback.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Order #{feedback.orderId.slice(0, 8)}</span>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </CardDescription>
          </div>
          <Badge variant={ratingColor} className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            {feedback.rating}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Star Rating Display */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-5 h-5',
                  star <= feedback.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                )}
              />
            ))}
          </div>

          {/* Comment */}
          {feedback.comment && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-foreground leading-relaxed">{feedback.comment}</p>
            </div>
          )}

          {/* Dish Info (if specific dish feedback) */}
          {feedback.dishId && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <span>Feedback for specific dish</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getRatingColor(rating: number): 'default' | 'secondary' | 'destructive' {
  if (rating >= 4) return 'default';
  if (rating >= 3) return 'secondary';
  return 'destructive';
}
