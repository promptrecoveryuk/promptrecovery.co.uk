import { basePath } from '@/app/base-path';
import { pictures } from '@/app/data';
import { PictureImage } from '@/types';

export function getPictureAsImage(pictureIndex: number, sizeId: 0 | 1 | 2 = 0): PictureImage {
  const image = pictures[pictureIndex - 1];
  const data: PictureImage = {
    url: '',
    width: 0,
    height: 0,
    description: '',
  };

  switch (sizeId) {
    case 0:
      data.url = `${basePath}${image.filePath}`;
      data.width = image.width;
      data.height = image.height;
      data.description = image.description;
      return data;
    case 1:
      data.url = `${basePath}${image.filePath1}`;
      data.width = image.width1;
      data.height = image.height1;
      data.description = image.description;
      return data;
    case 2:
      data.url = `${basePath}${image.filePath2}`;
      data.width = image.width2;
      data.height = image.height2;
      data.description = image.description;
      return data;
  }
}
