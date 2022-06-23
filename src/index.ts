// import Jimp from 'jimp';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';
import { httpServer } from './http_server/index';
import 'dotenv/config';
import { drawCircle } from './modules/circle';
import { drawSquare } from './modules/square';
import { speed } from './utils/constants';

const HTTP_PORT = process.env.PORT || 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 8080 });

try {
  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      const [event, value] = data.toString().split(' ');
      const { x, y } = robot.getMousePos();
      const rightValue = +value;

      switch (event) {
        case 'mouse_right':
          robot.moveMouse(x + rightValue, y);
          break;

        case 'mouse_left':
          robot.moveMouse(x - rightValue, y);
          break;

        case 'mouse_up':
          robot.moveMouse(x, y - rightValue);
          break;

        case 'mouse_down':
          robot.moveMouse(x, y + rightValue);
          break;

        case 'mouse_position':
          ws.send(`mouse_position ${x},${y}`);
          break;

        case 'draw_circle':
          robot.mouseClick('left');
          robot.mouseToggle('down');
          drawCircle(x, y, rightValue);
          robot.mouseToggle('up');
          break;

        case 'draw_square':
          robot.mouseClick('left');
          robot.mouseToggle('down');
          drawSquare(x, y, rightValue, speed);
          robot.mouseToggle('up');
          break;

        default:
          break;
      }

      console.log('xyz', data.toString(), '|', x, y);
    });

    ws.send('something');
  });

  wss.on('close', () => {
    console.log('WebSocketServer closed!');
  });

  wss.on('error', (error) => {
    console.log('WebSocketServer has Error:', error);
  });
} catch (error) {
  console.log('Interval Error:', error);
}
