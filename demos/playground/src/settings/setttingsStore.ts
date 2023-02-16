/**
 * Ported from lexical/packages/lexical-playground/src/context/SettingsContext.tsx
 */

import {writable, type Writable} from 'svelte/store';
import {DEFAULT_SETTINGS, type SettingName, type Settings} from './appSettings';

export type SettingsStore = {
  subscribe: Writable<Settings>['subscribe'];
  setOption: (setting: SettingName, value: boolean) => void;
};

export function createSettingsStore(): SettingsStore {
  const {subscribe, /*set,*/ update} = writable(DEFAULT_SETTINGS);

  return {
    subscribe,
    setOption: (setting: SettingName, value: boolean) => {
      update((options) => ({
        ...options,
        [setting as string]: value,
      }));
      if (DEFAULT_SETTINGS[setting] === value) {
        setURLParam(setting, null);
      } else {
        setURLParam(setting, value);
      }
    },
  };
}

function setURLParam(param: SettingName, value: null | boolean) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  if (value !== null) {
    if (params.has(param)) {
      params.set(param, String(value));
    } else {
      params.append(param, String(value));
    }
  } else {
    if (params.has(param)) {
      params.delete(param);
    }
  }
  url.search = params.toString();
  window.history.pushState(null, '', url.toString());
}
