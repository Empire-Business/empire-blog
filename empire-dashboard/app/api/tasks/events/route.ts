// API Route: Server-Sent Events for real-time task updates
// GET /api/tasks/events - SSE stream

import { NextRequest } from 'next/server';
import { taskEvents } from '@/lib/events';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/tasks/events - SSE stream for real-time updates
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  let cleanup: (() => void) | undefined;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode(': connected\n\n'));

      // Subscribe to all task events
      const unsubscribe = taskEvents.onTaskEvent((event) => {
        try {
          const data = taskEvents.formatSSE(event);
          controller.enqueue(encoder.encode(data));
        } catch (error) {
          // Stream closed
          unsubscribe();
        }
      });

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          clearInterval(heartbeat);
          unsubscribe();
        }
      }, 30000);

      // Store cleanup function
      cleanup = () => {
        clearInterval(heartbeat);
        unsubscribe();
      };
    },

    cancel() {
      // Cleanup when client disconnects
      cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
