import {CAN_USE_DOM} from '@lexical/utils';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ThemeColor = Omit<ThemeMode, 'system'>;

class ThemeTracker {
  private darkModeMediaQuery = (CAN_USE_DOM &&
    window.matchMedia('(prefers-color-scheme: dark)')) as MediaQueryList;
  private themeMode = $state<ThemeMode>(
    (CAN_USE_DOM && (localStorage.getItem('app-theme') as ThemeMode)) ||
      'system',
  );
  private themeColor = $state<ThemeColor>('light');

  constructor() {
    if (!CAN_USE_DOM) return;
    this.updateTheme();
    this.darkModeMediaQuery.addEventListener('change', () =>
      this.updateTheme(),
    );
  }

  get mode() {
    return this.themeMode;
  }

  set mode(mode: ThemeMode) {
    this.themeMode = mode;
    this.updateTheme();
    localStorage.setItem('app-theme', mode);
  }

  get color() {
    return this.themeColor;
  }

  private updateTheme() {
    if (this.themeMode === 'system') {
      const currentColor = this.darkModeMediaQuery.matches ? 'dark' : 'light';
      if (currentColor !== this.themeColor) {
        this.themeColor = currentColor;
        this.setThemeInDom();
      }
    } else if (this.themeColor !== this.themeMode) {
      this.themeColor = this.themeMode;
      this.setThemeInDom();
    }
  }

  private setThemeInDom() {
    if (CAN_USE_DOM) {
      document.documentElement.setAttribute(
        'data-theme',
        this.themeColor as string,
      );
    }
  }
}

export const themeTracker = new ThemeTracker();
