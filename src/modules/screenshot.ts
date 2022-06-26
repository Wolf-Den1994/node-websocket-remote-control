import Jimp from 'jimp';
import robot from 'robotjs';

export const getScreenshot = async (x: number, y: number) => {
  const bmp = robot.screen.capture(x - 100, y - 100, 200, 200);

  for (let i = 0; i < bmp.image.length; i += 4) {
    if (i % 4 === 0) {
      [bmp.image[i], bmp.image[i + 2]] = [bmp.image[i + 2], bmp.image[i]];
    }
  }

  const imageJimp = new Jimp({ data: bmp.image, width: bmp.width, height: bmp.height }, (err: any, image: any) => {
    if (err) throw err;
    return image;
  });
  const parse = await imageJimp.getBase64Async(Jimp.MIME_PNG);
  return parse.split(',')[1];
};
