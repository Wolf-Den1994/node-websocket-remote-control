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

      switch (event) {
        case 'mouse_right':
          robot.moveMouse(x + value, y);
          break;

        case 'mouse_left':
          robot.moveMouse(x - value, y);
          break;

        case 'mouse_up':
          robot.moveMouse(x, y - value);
          break;

        case 'mouse_down':
          robot.moveMouse(x, y + value);
          break;

        case 'mouse_position':
          wsStrem.write(`mouse_position ${x},${y}`);
          break;

        case 'draw_circle':
          robot.mouseClick('left');
          robot.mouseToggle('down');
          drawCircle(x, y, value);
          robot.mouseToggle('up');
          break;

        case 'draw_square':
          robot.mouseClick('left');
          robot.mouseToggle('down');
          drawSquare(x, y, value, speed);
          robot.mouseToggle('up');
          break;

        case 'draw_rectangle':
          robot.mouseClick('left');
          robot.mouseToggle('down');
          drawRectangular(x, y, value, height, speed);
          robot.mouseToggle('up');
          break;

        case 'prnt_scrn': {
          try {
            const pngBuf = await getScreenshot(x, y);
            wsStrem.write(`prnt_scrn ${pngBuf}`);
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
