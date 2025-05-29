import ws from 'k6/ws';
import { check, sleep } from 'k6';
import http from 'k6/http';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  scenarios: {
    websocket_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '50s', target: 1000 },   // Ramp up to 1000 users
        { duration: '10s', target: 1000 },    // Stay at 1000 users
        { duration: '20s', target: 0 },    // Ramp down to 0 users
      ],
    },
  },
  thresholds: {
    'ws_connecting': ['p(95)<500'],        // 95% of connections should be established within 500ms
    'ws_msgs_received': ['rate>50'],       // Should receive at least 50 messages per second
    'http_req_duration': ['p(95)<2000'],   // 95% of HTTP requests should complete within 2s
  },
};

const BASE_URL = 'ws://localhost:8080/cable';

export default function () {
  const url = `${BASE_URL}`;
  const params = {
    headers: {
      'Origin': 'http://localhost:3000',
      'Sec-WebSocket-Protocol': 'actioncable-v1-json',
    },
  };

  const res = ws.connect(url, params, function (socket) {
    socket.on('open', () => {
      // Subscribe to the chat channel
      socket.send(JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({
          channel: 'ChatChannel'
        })
      }));
    });

    let receivedMessages = new Set();
    let messageLatencies = [];
    let startTime = new Date();
    let messagesSent = 0;
    let sentMessageIds = [];
    let subscriptionConfirmed = false;
    let numMessagesToSend = Math.floor(Math.random() * 3) + 2; // 2 to 4 messages

    socket.on('message', (data) => {
      const message = JSON.parse(data);
      
      if (message.type === 'confirm_subscription' && !subscriptionConfirmed) {
        subscriptionConfirmed = true;
        // Send 2-4 test messages after successful subscription
        for (let i = 0; i < numMessagesToSend; i++) {
          const messageId = randomString(10);
          const testMessage = {
            content: `Test message from VU ${__VU} - ${messageId}`,
            message_id: messageId
          };
          const httpResponse = http.post(
            'http://localhost:3000/messages',
            JSON.stringify({ message: testMessage }),
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              }
            }
          );
          check(httpResponse, {
            'message sent successfully': (r) => r.status === 200,
          });
          if (httpResponse.status === 200) {
            messagesSent++;
            sentMessageIds.push(messageId);
          }
        }
      }
      // Check if we received a broadcast message
      if (message.message && message.message.content) {
        const messageId = message.message.content.split('- ')[1];
        if (messageId && sentMessageIds.includes(messageId)) {
          receivedMessages.add(messageId);
          const latency = new Date() - startTime;
          messageLatencies.push(latency);
        }
      }
    });

    socket.setTimeout(function () {
      if (!subscriptionConfirmed) {
        console.log(`VU ${__VU} - Failed to confirm subscription`);
        return;
      }

      // Calculate message delivery metrics
      const receivedCount = receivedMessages.size;
      const deliveryRate = messagesSent > 0 ? (receivedCount / messagesSent) * 100 : 0;
      
      // Calculate latency metrics
      const avgLatency = messageLatencies.length > 0 
        ? messageLatencies.reduce((a, b) => a + b, 0) / messageLatencies.length 
        : 0;
      const maxLatency = messageLatencies.length > 0 ? Math.max(...messageLatencies) : 0;
      const minLatency = messageLatencies.length > 0 ? Math.min(...messageLatencies) : 0;

      console.log(`VU ${__VU} - Messages: ${receivedCount}/${messagesSent} (${deliveryRate.toFixed(2)}%)`);
      console.log(`VU ${__VU} - Latency: avg=${avgLatency.toFixed(2)}ms, min=${minLatency}ms, max=${maxLatency}ms`);

      check(receivedMessages, {
        'received at least 80% of messages': (msgs) => msgs.size >= messagesSent * 0.8,
        'average latency under 100ms': () => avgLatency < 100,
      });

      socket.close();
    }, 60000); // Reduced timeout to 1 minute
  });

  check(res, {
    'connected successfully': (r) => r && r.status === 101,
  });

  sleep(1);
} 