/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {moveToLineEnd, selectAll} from '../keyboardShortcuts/index.mjs';
import {
  assertHTML,
  click,
  focusEditor,
  html,
  initialize,
  repeat,
  test,
} from '../utils/index.mjs';

test.describe('Regression test #1083', () => {
  test.beforeEach(({isCollab, page}) => initialize({isCollab, page}));
  test(`Backspace with ElementNode at the front of the paragraph`, async ({
    page,
    isPlainText,
  }) => {
    test.skip(isPlainText);
    await focusEditor(page);

    await page.keyboard.type('Hello');
    await selectAll(page);
    await click(page, '.link');

    await moveToLineEnd(page);
    await page.keyboard.type('World');

    await assertHTML(
      page,
      html`
        <p
          class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
          dir="ltr"
        >
          <a
            href="https://"
            class="PlaygroundEditorTheme__link PlaygroundEditorTheme__ltr"
            dir="ltr"
          >
            <span data-lexical-text="true">Hello</span>
          </a>
          <span data-lexical-text="true">World</span>
        </p>
      `,
    );

    await selectAll(page);
    await page.keyboard.press('Backspace');

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test(`Backspace with ElementNode at the front of the selection`, async ({
    page,
    isPlainText,
  }) => {
    test.skip(isPlainText);
    await focusEditor(page);

    await page.keyboard.type('Say');

    await page.keyboard.type('Hello');
    await page.keyboard.down('Shift');
    await repeat('Hello'.length, async () => {
      await page.keyboard.press('ArrowLeft');
    });
    await page.keyboard.up('Shift');
    await click(page, '.link');

    await moveToLineEnd(page);
    await page.keyboard.type('World');

    await assertHTML(
      page,
      html`
        <p
          class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
          dir="ltr"
        >
          <span data-lexical-text="true">Say</span>
          <a
            href="https://"
            class="PlaygroundEditorTheme__link PlaygroundEditorTheme__ltr"
            dir="ltr"
          >
            <span data-lexical-text="true">Hello</span>
          </a>
          <span data-lexical-text="true">World</span>
        </p>
      `,
    );

    await page.keyboard.down('Shift');
    await repeat('HelloWorld'.length, async () => {
      await page.keyboard.press('ArrowLeft');
    });
    await page.keyboard.up('Shift');
    await page.keyboard.press('Backspace');

    await assertHTML(
      page,
      html`
        <p
          class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
          dir="ltr"
        >
          <span data-lexical-text="true">Say</span>
        </p>
      `,
    );
  });
});
