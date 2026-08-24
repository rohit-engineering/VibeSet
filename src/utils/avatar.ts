import { createAvatar } from '@dicebear/core';
import { bottts, lorelei, adventurer, thumbs, funEmoji, identicon } from '@dicebear/collection';

export type DiceBearStyle = 'bottts' | 'lorelei' | 'adventurer' | 'thumbs' | 'funEmoji' | 'identicon';

export interface AvatarOption {
  id: DiceBearStyle;
  label: string;
  description: string;
}

export const AVATAR_STYLES: AvatarOption[] = [
  { id: 'bottts', label: 'RoboBot', description: 'Tech & futuristic bot avatars' },
  { id: 'lorelei', label: 'Lorelei', description: 'Artistic modern illustrated portraits' },
  { id: 'adventurer', label: 'Adventurer', description: 'Vibrant character portraits' },
  { id: 'thumbs', label: 'Thumbies', description: 'Playful thumbs & expressive faces' },
  { id: 'funEmoji', label: 'Fun Emoji', description: 'Clean minimal emoji characters' }
];

export function getDiceBearAvatar(seed: string, style: DiceBearStyle = 'bottts'): string {
  const cleanSeed = (seed || 'digivault-user').trim().toLowerCase();

  try {
    let collectionStyle: any = bottts;
    if (style === 'lorelei') collectionStyle = lorelei;
    else if (style === 'adventurer') collectionStyle = adventurer;
    else if (style === 'thumbs') collectionStyle = thumbs;
    else if (style === 'funEmoji') collectionStyle = funEmoji;
    else if (style === 'identicon') collectionStyle = identicon;

    const avatar = createAvatar(collectionStyle, {
      seed: cleanSeed,
      radius: 50,
      size: 128,
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf']
    });

    return avatar.toDataUri();
  } catch (error) {
    console.warn('DiceBear generation fallback:', error);
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(cleanSeed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&radius=50`;
  }
}
