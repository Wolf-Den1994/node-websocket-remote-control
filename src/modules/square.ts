import robot from 'robotjs';

export const drawSquare = (x: number, y: number, width: number) => {
  robot.moveMouse(x - width, y);
  robot.moveMouse(x - width, y + width);
  robot.moveMouse(x, y + width);
  robot.moveMouse(x, y);
};
