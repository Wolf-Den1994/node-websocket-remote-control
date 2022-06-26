import robot from 'robotjs';

export const drawRectangular = (x: number, y: number, width: number, height: number) => {
  robot.moveMouse(x - width, y);
  robot.moveMouse(x - width, y + height);
  robot.moveMouse(x, y + height);
  robot.moveMouse(x, y);
};
