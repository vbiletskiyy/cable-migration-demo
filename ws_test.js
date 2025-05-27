import ws from 'k6/ws';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,        // number of concurrent users
  duration: '10s' // test duration
};

export default function () {
  const url = 'ws://localhost:8080/cable'; // <- Change to :3000 for ActionCable
  const params = {
    headers: {
      'Origin': 'http://localhost:3000'
    }
  };

  const res = ws.connect(url, params, function (socket) {
    socket.on('open', function open() {
      console.log('WebSocket connected');

      // Perform subscription
      const subscribeMessage = {
        command: 'subscribe',
        identifier: JSON.stringify({
          channel: 'ChatChannel'
        })
      };

      socket.send(JSON.stringify(subscribeMessage));

      // Send a test message via perform
      const performMessage = {
        command: 'message',
        identifier: JSON.stringify({ channel: 'ChatChannel' }),
        data: JSON.stringify({ action: 'speak', content: `Hello from VU ${__VU}` })
      };

      socket.send(JSON.stringify(performMessage));
    });

    socket.on('message', function (message) {
      console.log(`Message received: ${message}`);
    });

    socket.on('close', () => console.log('Socket closed'));
    socket.on('error', (e) => console.error(`Socket error: ${e}`));

    sleep(1); // keep the connection alive for 1s
  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
}
