/**
 * Error Logs Component
 * Displays system errors and logs with filtering and search capabilities
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
} from 'lucide-react';

export type LogLevel = 'error' | 'warning' | 'info' | 'critical';

export interface ErrorLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
  stackTrace?: string;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

interface ErrorLogsProps {
  logs: ErrorLog[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

function LogLevelBadge({ level }: { level: LogLevel }) {
  const variants = {
    critical: {
      className: 'bg-red-500 hover:bg-red-600',
      icon: XCircle,
      label: 'Critical',
    },
    error: {
      className: 'bg-red-400 hover:bg-red-500',
      icon: AlertCircle,
      label: 'Error',
    },
    warning: {
      className: 'bg-amber-500 hover:bg-amber-600',
      icon: AlertTriangle,
      label: 'Warning',
    },
    info: {
      className: 'bg-blue-500 hover:bg-blue-600',
      icon: Info,
      label: 'Info',
    },
  };

  const config = variants[level];
  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}

function LogEntry({ log }: { log: ErrorLog }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <LogLevelBadge level={log.level} />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </div>
            {log.source && (
              <Badge variant="outline" className="text-xs">
                {log.source}
              </Badge>
            )}
          </div>

          <p className="text-sm font-medium">{log.message}</p>

          {log.requestId && (
            <p className="text-xs text-muted-foreground">
              Request ID: {log.requestId}
            </p>
          )}

          {isExpanded && (
            <div className="mt-4 space-y-3">
              {log.stackTrace && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium">Stack Trace</span>
                  </div>
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                    {log.stackTrace}
                  </pre>
                </div>
              )}

              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium">Additional Details</span>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(log.metadata).map(([key, value]) => (
                      <div key={key} className="flex gap-2 text-xs">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-mono">
                          {typeof value === 'object'
                            ? JSON.stringify(value)
                            : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {log.userId && (
                <p className="text-xs text-muted-foreground">User ID: {log.userId}</p>
              )}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorLogs({ logs, isLoading, onRefresh, onExport }: ErrorLogsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Get unique sources for filter
  const sources = Array.from(new Set(logs.map((log) => log.source).filter(Boolean)));

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.requestId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesSource = sourceFilter === 'all' || log.source === sourceFilter;

    return matchesSearch && matchesLevel && matchesSource;
  });

  // Count by level
  const levelCounts = {
    critical: logs.filter((l) => l.level === 'critical').length,
    error: logs.filter((l) => l.level === 'error').length,
    warning: logs.filter((l) => l.level === 'warning').length,
    info: logs.filter((l) => l.level === 'info').length,
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">System Logs & Errors</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredLogs.length} of {logs.length} logs
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            )}
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Level Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Critical</span>
            </div>
            <p className="text-2xl font-bold">{levelCounts.critical}</p>
          </div>
          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-muted-foreground">Errors</span>
            </div>
            <p className="text-2xl font-bold">{levelCounts.error}</p>
          </div>
          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Warnings</span>
            </div>
            <p className="text-2xl font-bold">{levelCounts.warning}</p>
          </div>
          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Info</span>
            </div>
            <p className="text-2xl font-bold">{levelCounts.info}</p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Filters</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Logs List */}
      <Card className="p-6">
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No logs found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <LogEntry key={log.id} log={log} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
