import robot from 'robotjs';

const Mathutils = {
  normalize(value: number, min: number, max: number) {
    return (value - min) / (max - min);
  },
  interpolate(normValue: number, min: number, max: number) {
    return min + (max - min) * normValue;
  },
  map(value: number, min1: number, max1: number, min2: number, max2: number) {
    let newValue = value;
    if (newValue < min1) {
      newValue = min1;
    }
    if (newValue > max1) {
      newValue = max1;
    }
    const res = this.interpolate(this.normalize(newValue, min1, max1), min2, max2);

    return res;
  },
};

export const drawCircle = (x: number, y: number, radius: number) => {
  let coordinateX = x;
  let coordinateY = y;

  const updatePosition = (deg: number) => {
    const fig = Mathutils.map(deg, 0, 360, 0, 6.3);
    coordinateX = Math.floor(x + (radius * Math.cos(fig)));
    coordinateY = Math.floor(y + (radius * Math.sin(fig)));
    robot.moveMouse(coordinateX - radius, coordinateY);
  };

  for (let i = 1; i < 361; i += 1) {
    updatePosition(i);
  }
};
