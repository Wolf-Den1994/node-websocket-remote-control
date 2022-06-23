import robot from 'robotjs';

export const drawSquare = (x: number, y: number, width: number, speed: number) => {
  robot.moveMouseSmooth(x - width, y, speed);
  robot.moveMouseSmooth(x - width, y + width, speed);
  robot.moveMouseSmooth(x, y + width, speed);
  robot.moveMouseSmooth(x, y, speed);
};
