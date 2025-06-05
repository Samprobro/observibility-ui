export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogDetails {
  customerEmail?: string;
  amount?: number;
  items?: number;
  [key: string]: string | number | undefined;
}

// Define a more specific type for metadata values
export type MetadataValue = string | number | boolean | null | { [key: string]: MetadataValue } | MetadataValue[];

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  orderId: string;
  orderStage?: string;
  exception?: string;
  details?: LogDetails;
  traceId?: string;
  source?: string;
  metadata?: Record<string, MetadataValue>;
  service: string;
}

export interface LogStats {
  errorCount: number;
  fatalCount: number;
  warningCount: number;
  infoCount: number;
  debugCount: number;
  totalCount: number;
}

export interface OrderFlow {
  orderId: string;
  stages: {
    stage: string;
    timestamp: string;
    status: 'success' | 'error' | 'pending';
  }[];
} 