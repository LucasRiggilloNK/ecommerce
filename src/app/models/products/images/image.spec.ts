import { Image } from './image';

describe('Image', () => {
  it('should create an instance', () => {
    
    const image = new Image('urlImage');
    expect(image).toBeTruthy();
  });
});