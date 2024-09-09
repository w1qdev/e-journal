import { THEMES } from '@/constants/themes.ts';

export type Theme = (typeof THEMES)[number]['id'];
