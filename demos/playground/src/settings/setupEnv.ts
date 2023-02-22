/**
 * Copyright (c) Syed Umar Anis.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {DEFAULT_SETTINGS, type Settings} from './appSettings';

// override default options with query parameters if any
const urlSearchParams = new URLSearchParams(window.location.search);

for (const param of Object.keys(DEFAULT_SETTINGS)) {
  if (urlSearchParams.has(param)) {
    try {
      const value = JSON.parse(urlSearchParams.get(param) ?? 'true');
      DEFAULT_SETTINGS[param as keyof Settings] = Boolean(value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Unable to parse query parameter "${param}"`);
    }
  }
}

if (DEFAULT_SETTINGS.disableBeforeInput) {
  // @ts-expect-error enable legacy events
  delete window.InputEvent.prototype.getTargetRanges;
}
