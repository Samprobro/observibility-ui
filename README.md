# Log Analysis Dashboard

A modern web application built with Next.js for analyzing and visualizing log data from e-commerce transactions. The dashboard provides real-time monitoring of system logs, error tracking, and order flow visualization.

## Features

- Real-time log monitoring with automatic refresh
- Interactive data visualization using Chart.js
- Advanced filtering and sorting capabilities
- Detailed log inspection with modal view
- Responsive design for all screen sizes
- Error and exception tracking
- Order flow tracing
- Statistical analysis of log levels

## Tech Stack

- Next.js 13+ with App Router
- TypeScript
- Tailwind CSS for styling
- Chart.js for data visualization
- SWR for data fetching
- Heroicons for icons
- date-fns for date formatting

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── logs/
│   │       └── route.ts    # API endpoint for log data
│   └── page.tsx            # Main dashboard page
├── components/
│   ├── LogsChart.tsx       # Chart visualization component
│   ├── LogsTable.tsx       # Data table component
│   └── StatsCards.tsx      # Statistics display component
└── types/
    └── logs.ts            # TypeScript interfaces and types
```

## API Integration

The current implementation uses mock data. To integrate with your actual log data source:

1. Modify the `src/app/api/logs/route.ts` file
2. Replace the `generateMockLogs` function with your actual data fetching logic
3. Ensure the returned data matches the `LogEntry` interface defined in `src/types/logs.ts`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
