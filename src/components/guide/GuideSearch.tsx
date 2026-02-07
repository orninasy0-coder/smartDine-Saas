import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface SearchResult {
  id: string;
  title: string;
  section: string;
  excerpt: string;
}

interface GuideSearchProps {
  onResultClick: (sectionId: string) => void;
  searchableContent: SearchResult[];
  className?: string;
}

export function GuideSearch({ onResultClick, searchableContent, className }: GuideSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = searchableContent.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.excerpt.toLowerCase().includes(searchQuery) ||
        item.section.toLowerCase().includes(searchQuery)
    );

    setResults(filtered.slice(0, 5)); // Limit to 5 results
    setIsOpen(filtered.length > 0);
  }, [query, searchableContent]);

  const handleResultClick = (sectionId: string) => {
    onResultClick(sectionId);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search in guide..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result.id)}
                  className={cn(
                    'w-full text-left p-4 hover:bg-muted transition-colors',
                    index !== results.length - 1 && 'border-b border-border'
                  )}
                >
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{result.title}</div>
                    <div className="text-xs text-muted-foreground">{result.section}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {result.excerpt}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-2 bg-muted/50 border-t border-border text-center">
              <span className="text-xs text-muted-foreground">
                {results.length} results
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      {isOpen && results.length === 0 && query.trim().length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg p-4 z-50"
        >
          <p className="text-sm text-muted-foreground text-center">
            No results found
          </p>
        </motion.div>
      )}
    </div>
  );
}
