import robot from 'robotjs';

export const drawRectangular = (x: number, y: number, width: number, height: number, speed: number) => {
  robot.moveMouseSmooth(x - width, y, speed);
  robot.moveMouseSmooth(x - width, y + height, speed);
  robot.moveMouseSmooth(x, y + height, speed);
  robot.moveMouseSmooth(x, y, speed);
};
