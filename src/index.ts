import robot from 'robotjs';
import { EOL } from 'os';
import { WebSocketServer, createWebSocketStream } from 'ws';
import { httpServer } from './http_server/index';
import 'dotenv/config';
import {
  drawSquare, drawCircle, drawRectangular, getScreenshot,
} from './modules';
import { speed } from './utils/constants';

const HTTP_PORT = process.env.PORT || 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 8080 });

try {
  wss.on('headers', (headers, request) => {
    const firstPart = `${headers[2]}!${EOL}`;
    const secondPart = `${request.rawHeaders[0]}: ${request.rawHeaders[1]} with front: ${request.rawHeaders[13]}`;
    console.log(`${firstPart}Websocket has been started on ${secondPart}`);
  });

  wss.on('connection', (ws) => {
    const wsStrem = createWebSocketStream(ws, { encoding: 'utf-8', decodeStrings: false });

    wsStrem.on('data', async (chunk) => {
      const data = chunk.toString();
      const [event, firstResponseValue, secondResponseValue] = data.toString().split(' ');
      const { x, y } = robot.getMousePos();
      const value = +firstResponseValue;
      const height = +secondResponseValue;

      if (event !== 'mouse_position' && event !== 'prnt_scrn') wsStrem.write(`${data}\0`);

      console.log('Received:', data);

      switch (event) {
        case 'mouse_right':
          robot.moveMouse(x + value, y);
          console.log('Result:', event, 'completed successfully!');
          break;

        case 'mouse_left':
          robot.moveMouse(x - value, y);
          console.log('Result:', event, 'completed successfully!');
          break;

        case 'mouse_up':
          robot.moveMouse(x, y - value);
          console.log('Result:', event, 'completed successfully!');
          break;

        case 'mouse_down':
          robot.moveMouse(x, y + value);
          console.log('Result:', event, 'completed successfully!');
          break;

        case 'mouse_position':
          wsStrem.write(`mouse_position ${x},${y}\0`);
          console.log('Result:', event, `${x},${y}`, 'completed successfully!');
          break;

        case 'draw_circle':
          console.log('Result: start drawing circle');
          robot.mouseClick('left');
          robot.mouseToggle('down');
          drawCircle(x, y, value);
          robot.mouseToggle('up');
          console.log('Result: finish drawing circle,', event, 'completed successfully!');
          break;

        case 'draw_square':
          console.log('Result: start drawing square');
          robot.mouseClick('left');
          robot.mouseToggle('down');
          drawSquare(x, y, value, speed);
          robot.mouseToggle('up');
          console.log('Result: finish drawing square,', event, 'completed successfully!');
          break;

        case 'draw_rectangle':
          console.log('Result: start drawing rectangle');
          robot.mouseClick('left');
          robot.mouseToggle('down');
          drawRectangular(x, y, value, height, speed);
          robot.mouseToggle('up');
          console.log('Result: finish drawing rectangle,', event, 'completed successfully!');
          break;

        case 'prnt_scrn': {
          try {
            const pngBuf = await getScreenshot(x, y);
            wsStrem.write(`prnt_scrn ${pngBuf}\0`);
            console.log('Result:', event, 'completed successfully!');
          } catch (error) {
            console.error('Error:', error);
          }
          break;
        }

        default:
          break;
      }
    })
      .on('error', (error) => {
        console.log('webSocketStream has Error:', error);
      })
      .on('close', () => wsStrem.end());

    wss.on('close', () => {
      console.log('WebSocketServer closed!');
      wsStrem.end();
    });

    wss.on('error', (error) => {
      console.log('WebSocketServer has Error:', error);
    });
  });
} catch (error) {
  console.log('Interval Error:', error);
}

process.on('SIGINT', () => {
  process.stdout.write(`Websocket has been closed!${EOL}`);
  wss.close();
  process.exit();
});
