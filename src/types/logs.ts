export type LogLevel = 'ERROR' | 'FATAL' | 'INFO' | 'WARNING' | 'DEBUG';

export interface LogDetails {
  customerEmail?: string;
  amount?: number;
  items?: number;
  [key: string]: string | number | undefined;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  orderId?: string;
  orderStage?: string;
  exception?: string;
  details?: LogDetails;
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