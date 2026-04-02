export const ASPECT_RATIOS = {
  hero: { label: 'Panoramic (Hero)', value: 'aspect-[1620/700]', res: '1620x700px' },
  video: { label: 'Video (16:9)', value: 'aspect-video', res: '1280x720px' },
  square: { label: 'Square (1:1)', value: 'aspect-square', res: '1000x1000px' },
  card: { label: 'Standard Card (3:2)', value: 'aspect-[3/2]', res: '1200x800px' },
  portrait: { label: 'Portrait (4:5)', value: 'aspect-[4/5]', res: '800x1000px' },
  wide: { label: 'Banner (12:5)', value: 'aspect-[12/5]', res: '1920x800px' },
  logo: { label: 'Logo (2:1)', value: 'aspect-[2/1]', res: '400x200px' }
};

export type AspectRatioType = keyof typeof ASPECT_RATIOS;

export const getRatioClass = (type: string | undefined, defaultClass: string = 'aspect-square') => {
  if (!type) return defaultClass;
  return (ASPECT_RATIOS as any)[type]?.value || defaultClass;
};

export const getRatioRes = (type: string | undefined) => {
  if (!type) return '1200x800px';
  return (ASPECT_RATIOS as any)[type]?.res || '1200x800px';
};
