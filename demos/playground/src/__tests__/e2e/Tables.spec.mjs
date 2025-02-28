/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  deleteBackward,
  moveDown,
  moveLeft,
  moveRight,
  moveToEditorBeginning,
  moveUp,
  pressBackspace,
  selectAll,
  selectCharacters,
} from '../keyboardShortcuts/index.mjs';
import os from 'os';
import {
  assertHTML as rawAssertHTML,
  assertSelection,
  click,
  clickSelectors,
  copyToClipboard,
  deleteTableColumns,
  deleteTableRows,
  expect,
  focusEditor,
  html,
  initialize,
  insertCollapsible,
  insertHorizontalRule,
  insertSampleImage,
  insertTable,
  insertTableColumnBefore,
  insertTableRowBelow,
  IS_COLLAB,
  IS_LINUX,
  IS_TABLE_HORIZONTAL_SCROLL,
  IS_WINDOWS,
  LEGACY_EVENTS,
  mergeTableCells,
  pasteFromClipboard,
  SAMPLE_IMAGE_URL,
  selectCellsFromTableCords,
  selectFromAdditionalStylesDropdown,
  selectFromAlignDropdown,
  selectorBoundingBox,
  setBackgroundColor,
  test,
  toggleColumnHeader,
  unmergeTableCell,
  waitForSelector,
  withExclusiveClipboardAccess,
  wrapTableHtml,
} from '../utils/index.mjs';

async function fillTablePartiallyWithText(page) {
  await page.keyboard.type('a');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('b');
  await page.keyboard.press('Tab');
  await page.keyboard.press('c');
  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');
  await page.keyboard.press('b');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('d');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('e');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('f');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('c');
}

async function assertHTML(
  page,
  expectedHtml,
  expectedHtmlFrameRight = undefined,
  options = undefined,
  ...args
) {
  return await rawAssertHTML(
    page,
    IS_TABLE_HORIZONTAL_SCROLL
      ? wrapTableHtml(expectedHtml, options)
      : expectedHtml,
    IS_TABLE_HORIZONTAL_SCROLL && expectedHtmlFrameRight !== undefined
      ? wrapTableHtml(expectedHtmlFrameRight, options)
      : expectedHtmlFrameRight,
    options,
    ...args,
  );
}

const WRAPPER = IS_TABLE_HORIZONTAL_SCROLL ? [0] : [];

test.describe.parallel('Tables', () => {
  //test.fixme();
  test(`Can a table be inserted from the toolbar`, async ({
    page,
    isPlainText,
    isCollab,
  }) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);
    await focusEditor(page);

    await insertTable(page, 2, 2);

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      undefined,
      {ignoreClasses: true},
    );
  });

  test(`Can type inside of table cell`, async ({
    page,
    isPlainText,
    isCollab,
  }) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 2, 2);

    await page.keyboard.type('abc');

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">abc</span></p>
            </th>
            <th>
              <p><br /></p>
            </th>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      undefined,
      {ignoreClasses: true},
    );
  });

  test.describe
    .parallel(`Can exit tables with the horizontal arrow keys`, () => {
    test(`Can exit the first cell of a non-nested table`, async ({
      page,
      isPlainText,
      isCollab,
    }) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);
      await insertTable(page, 2, 2);

      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 1, 0, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 1, 0, 0],
      });

      await moveLeft(page, 1);

      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [0],
        focusOffset: 0,
        focusPath: [0],
      });

      await moveRight(page, 1);
      await page.keyboard.type('ab');

      await assertSelection(page, {
        anchorOffset: 2,
        anchorPath: [1, ...WRAPPER, 1, 0, 0, 0, 0],
        focusOffset: 2,
        focusPath: [1, ...WRAPPER, 1, 0, 0, 0, 0],
      });

      await moveRight(page, 3);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 2, 1, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 2, 1, 0],
      });
    });

    test(`Can exit the last cell of a non-nested table`, async ({
      page,
      isPlainText,
      isCollab,
    }) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);
      await insertTable(page, 2, 2);

      await moveRight(page, 3);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 2, 1, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 2, 1, 0],
      });

      await moveRight(page, 1);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [2],
        focusOffset: 0,
        focusPath: [2],
      });

      await moveLeft(page, 1);
      await page.keyboard.type('ab');
      await assertSelection(page, {
        anchorOffset: 2,
        anchorPath: [1, ...WRAPPER, 2, 1, 0, 0, 0],
        focusOffset: 2,
        focusPath: [1, ...WRAPPER, 2, 1, 0, 0, 0],
      });

      await moveRight(page, 3);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [2],
        focusOffset: 0,
        focusPath: [2],
      });
    });

    test(`Can exit the first cell of a nested table into the parent table cell`, async ({
      page,
      isPlainText,
      isCollab,
    }) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);
      await insertTable(page, 2, 2);
      await insertTable(page, 2, 2);

      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 1, 0, 1, ...WRAPPER, 1, 0, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 1, 0, 1, ...WRAPPER, 1, 0, 0],
      });

      await moveLeft(page, 1);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 1, 0, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 1, 0, 0],
      });
    });

    test(`Can exit the last cell of a nested table into the parent table cell`, async ({
      page,
      isPlainText,
      isCollab,
    }) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);
      await insertTable(page, 2, 2);
      await insertTable(page, 2, 2);

      await moveRight(page, 3);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 1, 0, 1, ...WRAPPER, 2, 1, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 1, 0, 1, ...WRAPPER, 2, 1, 0],
      });

      await moveRight(page, 1);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 1, 0, 2],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 1, 0, 2],
      });
    });
  });

  test(`Can insert a paragraph after a table, that is the last node, with the "Enter" key`, async ({
    page,
    isPlainText,
    isCollab,
    browserName,
    legacyEvents,
  }) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);
    // Table edge cursor doesn't show up in Firefox.
    test.fixme(browserName === 'firefox');
    test.fixme(
      legacyEvents && browserName === 'chromium' && IS_WINDOWS,
      'Flaky on Windows + Chromium + legacy events',
    );

    await focusEditor(page);
    await insertTable(page, 2, 2);

    await moveDown(page, 2);
    await assertSelection(page, {
      anchorOffset: 0,
      anchorPath: [2],
      focusOffset: 0,
      focusPath: [2],
    });

    await deleteBackward(page);
    await assertSelection(page, {
      anchorOffset: 0,
      anchorPath: [1, ...WRAPPER, 2, 1, 0],
      focusOffset: 0,
      focusPath: [1, ...WRAPPER, 2, 1, 0],
    });
    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
          </tr>
        </table>
      `,
      undefined,
      {ignoreClasses: true},
    );

    await moveRight(page, 1);
    if (WRAPPER.length === 0) {
      // The native window selection should be on the root, whereas
      // the editor selection should be on the last cell of the table.
      await assertSelection(page, {
        anchorOffset: 2,
        anchorPath: [],
        focusOffset: 2,
        focusPath: [],
      });
    } else {
      // The native window selection is in the wrapper after the table
      await assertSelection(page, {
        anchorOffset: WRAPPER[0] + 1,
        anchorPath: [1],
        focusOffset: WRAPPER[0] + 1,
        focusPath: [1],
      });
    }

    await page.keyboard.press('Enter');
    await assertSelection(page, {
      anchorOffset: 0,
      anchorPath: [2],
      focusOffset: 0,
      focusPath: [2],
    });

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      undefined,
      {ignoreClasses: true},
    );
  });

  test(`Can type text after a table that is the last node`, async ({
    page,
    isPlainText,
    isCollab,
    browserName,
  }) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);
    // Table edge cursor doesn't show up in Firefox.
    test.fixme(browserName === 'firefox');
    // After typing, the dom selection gets set back to the internal previous selection during the update.
    test.fixme(LEGACY_EVENTS);

    await focusEditor(page);
    await insertTable(page, 2, 2);

    await moveDown(page, 2);
    await deleteBackward(page);

    await moveRight(page, 1);
    await page.keyboard.type('a');
    await assertSelection(page, {
      anchorOffset: 1,
      anchorPath: [2, 0, 0],
      focusOffset: 1,
      focusPath: [2, 0, 0],
    });

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p dir="ltr"><span data-lexical-text="true">a</span></p>
      `,
      undefined,
      {ignoreClasses: true},
    );
  });

  test(`Can enter a table from a paragraph underneath via the left arrow key`, async ({
    page,
    isPlainText,
    isCollab,
  }) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 2, 2);

    await moveDown(page, 2);
    await assertSelection(page, {
      anchorOffset: 0,
      anchorPath: [2],
      focusOffset: 0,
      focusPath: [2],
    });

    await moveLeft(page, 1);
    await assertSelection(page, {
      anchorOffset: 0,
      anchorPath: [1, ...WRAPPER, 2, 1, 0],
      focusOffset: 0,
      focusPath: [1, ...WRAPPER, 2, 1, 0],
    });
  });

  test.describe.parallel(`Can navigate table with keyboard`, () => {
    test(`Can navigate cells horizontally`, async ({
      page,
      isPlainText,
      isCollab,
    }) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);
      await insertTable(page, 2, 2);

      await assertHTML(
        page,
        html`
          <p><br /></p>
          <table>
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th>
                <p><br /></p>
              </th>
              <th>
                <p><br /></p>
              </th>
            </tr>
            <tr>
              <th>
                <p><br /></p>
              </th>
              <td>
                <p><br /></p>
              </td>
            </tr>
          </table>
          <p><br /></p>
        `,
        undefined,
        {ignoreClasses: true},
      );

      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 1, 0, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 1, 0, 0],
      });

      await moveRight(page, 1);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 1, 1, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 1, 1, 0],
      });

      await moveRight(page, 1);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 2, 0, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 2, 0, 0],
      });

      await moveRight(page, 1);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 2, 1, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 2, 1, 0],
      });

      await moveLeft(page, 1);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 2, 0, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 2, 0, 0],
      });

      await moveLeft(page, 1);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 1, 1, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 1, 1, 0],
      });

      await moveLeft(page, 1);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 1, 0, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 1, 0, 0],
      });
    });

    test(`Can navigate cells vertically`, async ({
      page,
      isPlainText,
      isCollab,
    }) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);
      await insertTable(page, 2, 2);

      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 1, 0, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 1, 0, 0],
      });

      await moveDown(page, 1);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 2, 0, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 2, 0, 0],
      });

      await moveUp(page, 1);
      await assertSelection(page, {
        anchorOffset: 0,
        anchorPath: [1, ...WRAPPER, 1, 0, 0],
        focusOffset: 0,
        focusPath: [1, ...WRAPPER, 1, 0, 0],
      });
    });

    test.fixme(
      'Should not navigate cells when typeahead menu is open and focused',
      async ({page, isCollab, isPlainText}) => {
        await initialize({isCollab, page});
        test.skip(isPlainText);

        await focusEditor(page);
        await insertTable(page, 2, 2);

        await page.keyboard.type('@A');
        await assertSelection(page, {
          anchorOffset: 2,
          anchorPath: [1, ...WRAPPER, 1, 0, 0, 0, 0],
          focusOffset: 2,
          focusPath: [1, ...WRAPPER, 1, 0, 0, 0, 0],
        });

        await waitForSelector(
          page,
          `#typeahead-menu ul li:first-child.selected`,
        );

        await moveDown(page, 1);
        await assertSelection(page, {
          anchorOffset: 2,
          anchorPath: [1, ...WRAPPER, 1, 0, 0, 0, 0],
          focusOffset: 2,
          focusPath: [1, ...WRAPPER, 1, 0, 0, 0, 0],
        });

        await waitForSelector(
          page,
          '#typeahead-menu ul li:nth-child(2).selected',
        );
      },
    );
  });

  test(
    `Can select cells using Table selection`,
    {
      tag: '@flaky',
    },
    async ({page, isPlainText, isCollab}) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);
      await insertTable(page, 2, 3);

      await fillTablePartiallyWithText(page);
      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 1, y: 1},
        true,
        false,
      );

      await assertHTML(
        page,
        html`
          <p><br /></p>
          <table>
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th class="PlaygroundEditorTheme__tableCellSelected">
                <p dir="ltr"><span data-lexical-text="true">a</span></p>
              </th>
              <th class="PlaygroundEditorTheme__tableCellSelected">
                <p dir="ltr"><span data-lexical-text="true">bb</span></p>
              </th>
              <th>
                <p dir="ltr"><span data-lexical-text="true">cc</span></p>
              </th>
            </tr>
            <tr>
              <th class="PlaygroundEditorTheme__tableCellSelected">
                <p dir="ltr"><span data-lexical-text="true">d</span></p>
              </th>
              <td class="PlaygroundEditorTheme__tableCellSelected">
                <p dir="ltr"><span data-lexical-text="true">e</span></p>
              </td>
              <td>
                <p dir="ltr"><span data-lexical-text="true">f</span></p>
              </td>
            </tr>
          </table>
          <p><br /></p>
        `,
        html`
          <p><br /></p>
          <table>
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th>
                <p dir="ltr"><span data-lexical-text="true">a</span></p>
              </th>
              <th>
                <p dir="ltr"><span data-lexical-text="true">bb</span></p>
              </th>
              <th>
                <p dir="ltr"><span data-lexical-text="true">cc</span></p>
              </th>
            </tr>
            <tr>
              <th>
                <p dir="ltr"><span data-lexical-text="true">d</span></p>
              </th>
              <td>
                <p dir="ltr"><span data-lexical-text="true">e</span></p>
              </td>
              <td>
                <p dir="ltr"><span data-lexical-text="true">f</span></p>
              </td>
            </tr>
          </table>
          <p><br /></p>
        `,
        {ignoreClasses: true},
      );
    },
  );

  test(`Can select cells using Table selection via keyboard`, async ({
    page,
    isPlainText,
    isCollab,
    browserName,
  }) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 3, 3);

    await fillTablePartiallyWithText(page);

    let p = page;

    if (IS_COLLAB) {
      await focusEditor(page);
      p = await page.frame('left');
    }

    const firstRowFirstColumnCellBoundingBox = await p.locator(
      'table:first-of-type > :nth-match(tr, 1) > th:nth-child(1)',
    );

    // Focus on inside the iFrame or the boundingBox() below returns null.
    await firstRowFirstColumnCellBoundingBox.click();

    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowRight');
    // Firefox range selection spans across cells after two arrow key press
    if (browserName === 'firefox') {
      await page.keyboard.press('ArrowRight');
    }
    await page.keyboard.press('ArrowDown');
    await page.keyboard.up('Shift');

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th class="PlaygroundEditorTheme__tableCellSelected">
              <p dir="ltr"><span data-lexical-text="true">a</span></p>
            </th>
            <th class="PlaygroundEditorTheme__tableCellSelected">
              <p dir="ltr"><span data-lexical-text="true">bb</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">cc</span></p>
            </th>
          </tr>
          <tr>
            <th class="PlaygroundEditorTheme__tableCellSelected">
              <p dir="ltr"><span data-lexical-text="true">d</span></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCellSelected">
              <p dir="ltr"><span data-lexical-text="true">e</span></p>
            </td>
            <td>
              <p dir="ltr"><span data-lexical-text="true">f</span></p>
            </td>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
            <td>
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      html`
        <p><br /></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">a</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">bb</span></p>
            </th>
            <th>
              <p dir="ltr"><span data-lexical-text="true">cc</span></p>
            </th>
          </tr>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">d</span></p>
            </th>
            <td>
              <p dir="ltr"><span data-lexical-text="true">e</span></p>
            </td>
            <td>
              <p dir="ltr"><span data-lexical-text="true">f</span></p>
            </td>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
            <td>
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      {ignoreClasses: true, ignoreInlineStyles: true},
    );
  });

  test(
    `Can style text using Table selection`,
    {
      tag: '@flaky',
    },
    async ({page, isPlainText, isCollab}) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);
      await insertTable(page, 2, 3);

      await fillTablePartiallyWithText(page);
      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 1, y: 1},
        true,
        false,
      );

      await clickSelectors(page, ['.bold', '.italic', '.underline']);

      await selectFromAdditionalStylesDropdown(page, '.strikethrough');

      // Check that the character styles are applied.
      await assertHTML(
        page,
        html`
          <p><br /></p>
          <table>
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th class="PlaygroundEditorTheme__tableCellSelected">
                <p dir="ltr"><strong data-lexical-text="true">a</strong></p>
              </th>
              <th class="PlaygroundEditorTheme__tableCellSelected">
                <p dir="ltr"><strong data-lexical-text="true">bb</strong></p>
              </th>
              <th>
                <p dir="ltr"><span data-lexical-text="true">cc</span></p>
              </th>
            </tr>
            <tr>
              <th class="PlaygroundEditorTheme__tableCellSelected">
                <p dir="ltr"><strong data-lexical-text="true">d</strong></p>
              </th>
              <td class="PlaygroundEditorTheme__tableCellSelected">
                <p dir="ltr"><strong data-lexical-text="true">e</strong></p>
              </td>
              <td>
                <p dir="ltr"><span data-lexical-text="true">f</span></p>
              </td>
            </tr>
          </table>
          <p><br /></p>
        `,
        html`
          <p><br /></p>
          <table>
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th>
                <p dir="ltr"><strong data-lexical-text="true">a</strong></p>
              </th>
              <th>
                <p dir="ltr"><strong data-lexical-text="true">bb</strong></p>
              </th>
              <th>
                <p dir="ltr"><span data-lexical-text="true">cc</span></p>
              </th>
            </tr>
            <tr>
              <th>
                <p dir="ltr"><strong data-lexical-text="true">d</strong></p>
              </th>
              <td>
                <p dir="ltr"><strong data-lexical-text="true">e</strong></p>
              </td>
              <td>
                <p dir="ltr"><span data-lexical-text="true">f</span></p>
              </td>
            </tr>
          </table>
          <p><br /></p>
        `,
        {ignoreClasses: true},
      );
    },
  );

  test(`Can style on empty table cells and paragraphs with no text`, async ({
    page,
    isPlainText,
    isCollab,
  }) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 2, 3);
    await selectAll(page);

    // Apply style on empty table
    await clickSelectors(page, ['.bold']);

    // Add text after applying styles
    await click(page, 'div[contenteditable="true"] p:first-of-type');
    await page.keyboard.type('abc');

    await click(page, 'th p:first-of-type');
    await fillTablePartiallyWithText(page);

    // Check that the character styles are applied.
    await assertHTML(
      page,
      html`
        <p dir="ltr"><strong data-lexical-text="true">abc</strong></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th>
              <p dir="ltr"><strong data-lexical-text="true">a</strong></p>
            </th>
            <th>
              <p dir="ltr"><strong data-lexical-text="true">bb</strong></p>
            </th>
            <th>
              <p dir="ltr"><strong data-lexical-text="true">cc</strong></p>
            </th>
          </tr>
          <tr>
            <th>
              <p dir="ltr"><strong data-lexical-text="true">d</strong></p>
            </th>
            <td>
              <p dir="ltr"><strong data-lexical-text="true">e</strong></p>
            </td>
            <td>
              <p dir="ltr"><strong data-lexical-text="true">f</strong></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      html`
        <p dir="ltr"><strong data-lexical-text="true">abc</strong></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th>
              <p dir="ltr"><strong data-lexical-text="true">a</strong></p>
            </th>
            <th>
              <p dir="ltr"><strong data-lexical-text="true">bb</strong></p>
            </th>
            <th>
              <p dir="ltr"><strong data-lexical-text="true">cc</strong></p>
            </th>
          </tr>
          <tr>
            <th>
              <p dir="ltr"><strong data-lexical-text="true">d</strong></p>
            </th>
            <td>
              <p dir="ltr"><strong data-lexical-text="true">e</strong></p>
            </td>
            <td>
              <p dir="ltr"><strong data-lexical-text="true">f</strong></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      {ignoreClasses: true},
    );
  });

  test(`Align selection style for table cells`, async ({
    page,
    isPlainText,
    isCollab,
  }) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 2, 3);

    // Add text in bold to first cell
    await click(page, 'th p:first-of-type');
    await page.keyboard.type('a');
    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.up('Shift');
    await clickSelectors(page, ['.bold']);

    // Apply bold style to whole table
    // Bold style shouldn't be applied to any paragraphs and removed from all cells
    await selectAll(page);
    await clickSelectors(page, ['.bold']);

    // Add text after applying styles
    await click(page, 'div[contenteditable="true"] p:first-of-type');
    await page.keyboard.type('abc');

    await click(page, 'th p:first-of-type');
    await fillTablePartiallyWithText(page);

    // None of the paragraphs have style applied
    await assertHTML(
      page,
      html`
        <p dir="ltr"><span data-lexical-text="true">abc</span></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">aa</span></p>
            </th>
            <th>
              <p><span data-lexical-text="true">bb</span></p>
            </th>
            <th>
              <p><span data-lexical-text="true">cc</span></p>
            </th>
          </tr>
          <tr>
            <th>
              <p><span data-lexical-text="true">d</span></p>
            </th>
            <td>
              <p><span data-lexical-text="true">e</span></p>
            </td>
            <td>
              <p><span data-lexical-text="true">f</span></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      html`
        <p dir="ltr"><span data-lexical-text="true">abc</span></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th>
              <p dir="ltr"><span data-lexical-text="true">aa</span></p>
            </th>
            <th>
              <p><span data-lexical-text="true">bb</span></p>
            </th>
            <th>
              <p><span data-lexical-text="true">cc</span></p>
            </th>
          </tr>
          <tr>
            <th>
              <p><span data-lexical-text="true">d</span></p>
            </th>
            <td>
              <p><span data-lexical-text="true">e</span></p>
            </td>
            <td>
              <p><span data-lexical-text="true">f</span></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      {ignoreClasses: true},
    );
  });

  test(
    `Can copy + paste (internal) using Table selection`,
    {
      tag: '@flaky',
    },
    async ({page, isPlainText, isCollab}) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);
      await insertTable(page, 2, 3);

      await fillTablePartiallyWithText(page);
      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 1, y: 1},
        true,
        false,
      );

      await withExclusiveClipboardAccess(async () => {
        const clipboard = await copyToClipboard(page);

        // For some reason you need to click the paragraph twice for this to pass
        // on Collab Firefox.
        await click(page, 'div.ContentEditable__root > p:first-of-type');
        await click(page, 'div.ContentEditable__root > p:first-of-type');

        await pasteFromClipboard(page, clipboard);
      });

      // Check that the character styles are applied.
      await assertHTML(
        page,
        html`
          <table>
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th>
                <p dir="ltr"><span data-lexical-text="true">a</span></p>
              </th>
              <th>
                <p dir="ltr"><span data-lexical-text="true">bb</span></p>
              </th>
            </tr>
            <tr>
              <th>
                <p dir="ltr"><span data-lexical-text="true">d</span></p>
              </th>
              <td>
                <p dir="ltr"><span data-lexical-text="true">e</span></p>
              </td>
            </tr>
          </table>
          <table>
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th>
                <p dir="ltr"><span data-lexical-text="true">a</span></p>
              </th>
              <th>
                <p dir="ltr"><span data-lexical-text="true">bb</span></p>
              </th>
              <th>
                <p dir="ltr"><span data-lexical-text="true">cc</span></p>
              </th>
            </tr>
            <tr>
              <th>
                <p dir="ltr"><span data-lexical-text="true">d</span></p>
              </th>
              <td>
                <p dir="ltr"><span data-lexical-text="true">e</span></p>
              </td>
              <td>
                <p dir="ltr"><span data-lexical-text="true">f</span></p>
              </td>
            </tr>
          </table>
          <p><br /></p>
        `,
        undefined,
        {ignoreClasses: true},
      );
    },
  );

  test(
    `Can clear text using Table selection`,
    {
      tag: '@flaky',
    },
    async ({page, isPlainText, isCollab}) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);
      await insertTable(page, 2, 3);

      await fillTablePartiallyWithText(page);
      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 1, y: 1},
        true,
        false,
      );

      await page.keyboard.press('Backspace');

      // Check that the text was cleared.
      await assertHTML(
        page,
        html`
          <p><br /></p>
          <table>
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th>
                <p><br /></p>
              </th>
              <th>
                <p><br /></p>
              </th>
              <th>
                <p dir="ltr"><span data-lexical-text="true">cc</span></p>
              </th>
            </tr>
            <tr>
              <th>
                <p><br /></p>
              </th>
              <td>
                <p><br /></p>
              </td>
              <td>
                <p dir="ltr"><span data-lexical-text="true">f</span></p>
              </td>
            </tr>
          </table>
          <p><br /></p>
        `,
        undefined,
        {ignoreClasses: true},
      );
    },
  );

  test(`Range Selection is corrected when it contains a partial Table.`, async ({
    page,
    isPlainText,
    isCollab,
  }) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);

    await focusEditor(page);
    await insertTable(page, 1, 2);
    await moveToEditorBeginning(page);

    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.up('Shift');

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th class="PlaygroundEditorTheme__tableCellSelected">
              <p><br /></p>
            </th>
            <th class="PlaygroundEditorTheme__tableCellSelected">
              <p><br /></p>
            </th>
          </tr>
        </table>
        <p><br /></p>
      `,
      html`
        <p><br /></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
          </tr>
        </table>
        <p><br /></p>
      `,
      {ignoreClasses: true},
    );
  });

  test(`Select All when document contains tables adds custom table styles.`, async ({
    page,
    isPlainText,
    isCollab,
  }) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);

    await focusEditor(page);
    await page.keyboard.type('Hello World');

    await insertTable(page, 2, 3);

    await selectAll(page);

    await assertHTML(
      page,
      html`
        <p dir="ltr"><span data-lexical-text="true">Hello World</span></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th class="PlaygroundEditorTheme__tableCellSelected">
              <p><br /></p>
            </th>
            <th class="PlaygroundEditorTheme__tableCellSelected">
              <p><br /></p>
            </th>
            <th class="PlaygroundEditorTheme__tableCellSelected">
              <p><br /></p>
            </th>
          </tr>
          <tr>
            <th class="PlaygroundEditorTheme__tableCellSelected">
              <p><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCellSelected">
              <p><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCellSelected">
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      html`
        <p dir="ltr"><span data-lexical-text="true">Hello World</span></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
          </tr>
          <tr>
            <th>
              <p><br /></p>
            </th>
            <td>
              <p><br /></p>
            </td>
            <td>
              <p><br /></p>
            </td>
          </tr>
        </table>
        <p><br /></p>
      `,
      {ignoreClasses: true},
    );
  });

  test('Can delete all with node selection', async ({
    page,
    isCollab,
    isPlainText,
  }) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);
    await focusEditor(page);
    await page.keyboard.type('Text before');
    await page.keyboard.press('Enter');
    await insertSampleImage(page);
    await page.keyboard.press('Enter');
    await page.keyboard.type('Text after');
    await insertTable(page, 2, 3);
    await selectAll(page);
    await page.keyboard.press('Backspace');
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test('Can delete all with range selection anchored in table', async ({
    page,
    isCollab,
    isPlainText,
  }) => {
    test.skip(isPlainText || isCollab);
    await initialize({isCollab, page});
    await focusEditor(page);
    await insertTable(page, 1, 1);
    // Remove paragraph before
    await moveUp(page);
    await page.keyboard.press('Backspace');
    await assertHTML(
      page,
      html`
        <table class="PlaygroundEditorTheme__table">
          <colgroup><col style="width: 92px" /></colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
    // Select all but from the table
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+A`);
    // The observer is active
    await expect(page.locator('.table-cell-action-button')).toBeVisible();
    await page.keyboard.press('Backspace');
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test(`Horizontal rule inside cell`, async ({page, isPlainText, isCollab}) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);
    await focusEditor(page);

    await insertTable(page, 1, 2);
    await page.keyboard.type('123');
    await insertHorizontalRule(page);

    await assertHTML(
      page,
      html`
        <p><br /></p>
        <table>
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th>
              <p><span data-lexical-text="true">123</span></p>
              <hr contenteditable="false" data-lexical-decorator="true" />
              <p><br /></p>
            </th>
            <th>
              <p><br /></p>
            </th>
          </tr>
        </table>
        <p><br /></p>
      `,
      undefined,
      {ignoreClasses: true},
    );
  });

  test(
    'Grid selection: can select multiple cells and insert an image',
    {
      tag: '@flaky',
    },
    async ({page, isPlainText, isCollab, browserName}) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);

      await insertTable(page, 2, 2);

      await click(page, '.PlaygroundEditorTheme__tableCell:first-child');
      await page.keyboard.type('Hello');

      await page.keyboard.down('Shift');
      await page.keyboard.press('ArrowRight');
      // Firefox range selection spans across cells after two arrow key press
      if (browserName === 'firefox') {
        await page.keyboard.press('ArrowRight');
      }
      await page.keyboard.press('ArrowDown');
      await page.keyboard.up('Shift');

      await insertSampleImage(page);
      await page.keyboard.type(' <- it works!');

      await waitForSelector(page, '.editor-image img');

      await assertHTML(
        page,
        html`
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p
                  class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                  dir="ltr">
                  <span data-lexical-text="true">Hello</span>
                </p>
              </th>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <td class="PlaygroundEditorTheme__tableCell">
                <p
                  class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                  dir="ltr">
                  <span
                    class="editor-image"
                    contenteditable="false"
                    data-lexical-decorator="true">
                    <div draggable="false">
                      <img
                        alt="Yellow flower in tilt shift lens"
                        draggable="false"
                        src="${SAMPLE_IMAGE_URL}"
                        style="height: inherit; max-width: 500px; width: inherit" />
                    </div>
                  </span>
                  <span data-lexical-text="true">&lt;- it works!</span>
                </p>
              </td>
            </tr>
          </table>
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        `,
      );
    },
  );

  test('Grid selection: can backspace lines, backspacing empty cell does not destroy it #3278', async ({
    page,
    isPlainText,
    isCollab,
  }) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);

    await focusEditor(page);

    await insertTable(page, 1, 2);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await page.keyboard.type('cell one');
    await moveRight(page, 1);
    await page.keyboard.type('first line');
    await page.keyboard.press('Enter');
    await page.keyboard.type('second line');

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">cell one</span>
              </p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">first line</span>
              </p>
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">second line</span>
              </p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );

    await pressBackspace(page, 50);
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">cell one</span>
              </p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test.fixme(
    'Can remove new lines in a collapsible section inside of a table',
    async ({page, isPlainText, isCollab, browserName}) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);

      await insertTable(page, 1, 2);
      await insertCollapsible(page);

      await page.keyboard.type('123');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.type('123');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');

      const collapsibleOpeningTag =
        browserName === 'chromium'
          ? '<div class="Collapsible__container" open="">'
          : '<details class="Collapsible__container" open="">';
      const collapsibleClosingTag =
        browserName === 'chromium' ? '</div>' : '</details>';

      await assertHTML(
        page,
        html`
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
                ${collapsibleOpeningTag}
                <summary class="Collapsible__title">
                  <p class="PlaygroundEditorTheme__paragraph">
                    <span data-lexical-text="true">123</span>
                  </p>
                </summary>
                <div class="Collapsible__content">
                  <p class="PlaygroundEditorTheme__paragraph">
                    <span data-lexical-text="true">123</span>
                  </p>
                  <p class="PlaygroundEditorTheme__paragraph"><br /></p>
                  <p class="PlaygroundEditorTheme__paragraph"><br /></p>
                  <p class="PlaygroundEditorTheme__paragraph"><br /></p>
                </div>
                ${collapsibleClosingTag}
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
          </table>
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        `,
      );

      await pressBackspace(page, 10);
      await assertHTML(
        page,
        html`
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
                ${collapsibleOpeningTag}
                <summary class="Collapsible__title">
                  <p class="PlaygroundEditorTheme__paragraph">
                    <span data-lexical-text="true">123</span>
                  </p>
                </summary>
                <div class="Collapsible__content">
                  <p class="PlaygroundEditorTheme__paragraph"><br /></p>
                </div>
                ${collapsibleClosingTag}
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
          </table>
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        `,
      );
    },
  );

  test.fixme(
    'Resize merged cells width (1)',
    async ({browserName, page, isPlainText, isCollab}) => {
      await initialize({isCollab, page});
      test.fixme(
        isCollab && IS_LINUX && browserName === 'firefox',
        'Flaky on Linux + Collab',
      );
      test.skip(isPlainText);
      if (IS_COLLAB) {
        // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
        page.setViewportSize({height: 1000, width: 3000});
      }

      await focusEditor(page);

      await insertTable(page, 3, 3);
      await click(page, '.PlaygroundEditorTheme__tableCell');
      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 1, y: 1},
        true,
        false,
      );
      await mergeTableCells(page);
      await click(page, 'td:nth-child(3) > .PlaygroundEditorTheme__paragraph');
      const resizerBoundingBox = await selectorBoundingBox(
        page,
        '.TableCellResizer__resizer:first-child',
      );
      const x = resizerBoundingBox.x + resizerBoundingBox.width / 2;
      const y = resizerBoundingBox.y + resizerBoundingBox.height / 2;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x + 50, y);
      await page.mouse.up();

      await assertHTML(
        page,
        html`
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 142px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
                colspan="2"
                rowspan="2">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
            <tr>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
            </tr>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
            </tr>
          </table>
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        `,
      );
    },
  );

  test.fixme(
    'Resize merged cells width (2)',
    {
      tag: '@flaky',
    },
    async ({page, isPlainText, isCollab}) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);
      if (IS_COLLAB) {
        // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
        page.setViewportSize({height: 1000, width: 3000});
      }

      await focusEditor(page);

      await insertTable(page, 3, 3);
      await click(page, '.PlaygroundEditorTheme__tableCell');
      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 1, y: 1},
        true,
        false,
      );
      await mergeTableCells(page);
      await click(page, 'th');
      const resizerBoundingBox = await selectorBoundingBox(
        page,
        '.TableCellResizer__resizer:first-child',
      );
      const x = resizerBoundingBox.x + resizerBoundingBox.width / 2;
      const y = resizerBoundingBox.y + resizerBoundingBox.height / 2;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x + 50, y);
      await page.mouse.up();

      await assertHTML(
        page,
        html`
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 142px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
                colspan="2"
                rowspan="2">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
            <tr>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
            </tr>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
            </tr>
          </table>
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        `,
      );
    },
  );

  test.fixme(
    'Resize merged cells height',
    async ({browserName, page, isPlainText, isCollab}) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);
      test.fixme(IS_COLLAB && IS_LINUX && browserName === 'firefox');
      if (IS_COLLAB) {
        // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
        page.setViewportSize({height: 1000, width: 3000});
      }

      await focusEditor(page);

      await insertTable(page, 3, 3);
      await click(page, '.PlaygroundEditorTheme__tableCell');
      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 1, y: 1},
        true,
        false,
      );
      await mergeTableCells(page);
      await click(page, 'th');
      const resizerBoundingBox = await selectorBoundingBox(
        page,
        '.TableCellResizer__resizer:nth-child(2)',
      );
      const x = resizerBoundingBox.x + resizerBoundingBox.width / 2;
      const y = resizerBoundingBox.y + resizerBoundingBox.height / 2;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x, y + 50);
      await page.mouse.up();

      await assertHTML(
        page,
        html`
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
                colspan="2"
                rowspan="2">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
            <tr style="height: 87px">
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
            </tr>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
            </tr>
          </table>
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        `,
        undefined,
        {
          ignoreClasses: false,
          ignoreInlineStyles: false,
        },
        (actualHtml) =>
          // flaky fix: +- 1px for the height assertion
          actualHtml.replace(
            '<tr style="height: 88px">',
            '<tr style="height: 87px">',
          ),
      );
    },
  );

  test('Merge/unmerge cells (1)', async ({
    page,
    isPlainText,
    browserName,
    isCollab,
  }) => {
    test.fixme(browserName === 'firefox');
    await initialize({isCollab, page});
    test.skip(isPlainText);
    if (IS_COLLAB) {
      // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
      page.setViewportSize({height: 1000, width: 3000});
    }

    await focusEditor(page);

    await insertTable(page, 1, 3);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await moveRight(page, 1);
    await page.keyboard.type('first');
    await page.keyboard.press('Tab');
    await page.keyboard.type('second');
    await selectCellsFromTableCords(
      page,
      {x: 1, y: 0},
      {x: 2, y: 0},
      true,
      true,
    );
    await mergeTableCells(page);
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              colspan="2">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">first</span>
              </p>
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">second</span>
              </p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );

    await unmergeTableCell(page);
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">first</span>
              </p>
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">second</span>
              </p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test('Merge/unmerge cells (2)', async ({
    page,
    isPlainText,
    browserName,
    isCollab,
  }) => {
    test.fixme(browserName === 'firefox');
    await initialize({isCollab, page});
    test.skip(isPlainText);
    if (IS_COLLAB) {
      // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
      page.setViewportSize({height: 1000, width: 3000});
    }

    await focusEditor(page);

    await insertTable(page, 3, 3);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await moveRight(page, 1);
    await page.keyboard.type('first');
    await page.keyboard.press('Tab');
    await page.keyboard.type('second');
    await selectCellsFromTableCords(
      page,
      {x: 1, y: 1},
      {x: 2, y: 2},
      false,
      false,
    );
    await mergeTableCells(page);
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">first</span>
              </p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">second</span>
              </p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td
              class="PlaygroundEditorTheme__tableCell"
              colspan="2"
              rowspan="2">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );

    await unmergeTableCell(page);
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">first</span>
              </p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">second</span>
              </p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test('Merged cell tab navigation forward', async ({
    page,
    isPlainText,
    isCollab,
    browserName,
  }) => {
    test.fixme(browserName === 'firefox');
    await initialize({isCollab, page});
    test.skip(isPlainText);
    test.skip(isCollab);

    await focusEditor(page);

    await insertTable(page, 3, 3);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await selectCellsFromTableCords(
      page,
      {x: 0, y: 0},
      {x: 0, y: 1},
      true,
      true,
    );
    await mergeTableCells(page);
    await selectCellsFromTableCords(
      page,
      {x: 1, y: 0},
      {x: 2, y: 0},
      true,
      true,
    );
    await mergeTableCells(page);
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              rowspan="2">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              colspan="2">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
    await click(page, '.PlaygroundEditorTheme__tableCell');
    for (const i of Array.from({length: 9 - 2}, (_v, idx) => idx)) {
      await page.keyboard.type(String(i));
      await page.keyboard.press('Tab');
    }
    await page.keyboard.type('Done!');
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              rowspan="2">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">0</span>
              </p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              colspan="2">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">1</span>
              </p>
            </th>
          </tr>
          <tr>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">2</span>
              </p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">3</span>
              </p>
            </td>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">4</span>
              </p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">5</span>
              </p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">6</span>
              </p>
            </td>
          </tr>
        </table>
        <p
          class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
          dir="ltr">
          <span data-lexical-text="true">Done!</span>
        </p>
      `,
    );
  });

  test('Merged cell tab navigation reverse', async ({
    page,
    isPlainText,
    isCollab,
    browserName,
  }) => {
    test.fixme(browserName === 'firefox');
    await initialize({isCollab, page});
    test.skip(isPlainText);
    test.skip(isCollab);

    await focusEditor(page);

    await insertTable(page, 3, 3);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await selectCellsFromTableCords(
      page,
      {x: 0, y: 0},
      {x: 0, y: 1},
      true,
      true,
    );
    await mergeTableCells(page);
    await selectCellsFromTableCords(
      page,
      {x: 1, y: 0},
      {x: 2, y: 0},
      true,
      true,
    );
    await mergeTableCells(page);
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              rowspan="2">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              colspan="2">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
    await click(page, ':nth-match(.PlaygroundEditorTheme__tableCell, 7)');
    for (const i of Array.from({length: 9 - 2}, (_v, idx) => idx)) {
      await page.keyboard.type(String(i));
      await page.keyboard.down('Shift');
      await page.keyboard.press('Tab');
      await page.keyboard.up('Shift');
    }
    await page.keyboard.type('Done!');
    await assertHTML(
      page,
      html`
        <p
          class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
          dir="ltr">
          <span data-lexical-text="true">Done!</span>
        </p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              rowspan="2">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">6</span>
              </p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              colspan="2">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">5</span>
              </p>
            </th>
          </tr>
          <tr>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">4</span>
              </p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">3</span>
              </p>
            </td>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">2</span>
              </p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">1</span>
              </p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph">
                <span data-lexical-text="true">0</span>
              </p>
            </td>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test('Merge with content', async ({
    page,
    isPlainText,
    browserName,
    isCollab,
  }) => {
    test.fixme(browserName === 'firefox');
    await initialize({isCollab, page});
    test.skip(isPlainText);
    if (IS_COLLAB) {
      // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
      page.setViewportSize({height: 1000, width: 3000});
    }

    await focusEditor(page);

    await insertTable(page, 3, 3);
    await moveDown(page, 1);
    await moveRight(page, 1);
    await page.keyboard.type('A');
    await moveRight(page, 1);
    await page.keyboard.type('B');
    await moveRight(page, 2);
    await page.keyboard.type('C');
    await moveRight(page, 1);
    await page.keyboard.type('D');

    await selectCellsFromTableCords(
      page,
      {x: 1, y: 1},
      {x: 2, y: 2},
      false,
      false,
    );
    await mergeTableCells(page);
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td
              class="PlaygroundEditorTheme__tableCell"
              colspan="2"
              rowspan="2">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">A</span>
              </p>
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">B</span>
              </p>
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">C</span>
              </p>
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">D</span>
              </p>
            </td>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test(
    'Select multiple merged cells (selection expands to a rectangle)',
    {
      tag: '@flaky',
    },
    async ({page, isPlainText, browserName, isCollab}) => {
      test.fixme(browserName === 'firefox');
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);

      await insertTable(page, 3, 3);

      await click(page, '.PlaygroundEditorTheme__tableCell');
      await moveDown(page, 1);
      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 0, y: 1},
        true,
        true,
      );
      await mergeTableCells(page);

      await moveRight(page, 1);
      await selectCellsFromTableCords(
        page,
        {x: 1, y: 0},
        {x: 2, y: 0},
        true,
        true,
      );
      await mergeTableCells(page);

      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 1, y: 0},
        true,
        true,
      );

      await assertHTML(
        page,
        html`
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
          <table
            class="PlaygroundEditorTheme__table PlaygroundEditorTheme__tableSelection">
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader PlaygroundEditorTheme__tableCellSelected"
                rowspan="2">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader PlaygroundEditorTheme__tableCellSelected"
                colspan="2">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
            <tr>
              <td
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellSelected">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
              <td
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellSelected">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
            </tr>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
            </tr>
          </table>
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        `,
        html`
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
                rowspan="2">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
                colspan="2">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
            <tr>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
            </tr>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
            </tr>
          </table>
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        `,
      );
    },
  );

  test(
    'Merge multiple merged cells and then unmerge',
    {
      tag: '@flaky',
    },
    async ({page, isPlainText, isCollab, browserName}) => {
      test.fixme(browserName === 'firefox' && isCollab);
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);

      await insertTable(page, 3, 3);

      await click(page, '.PlaygroundEditorTheme__tableCell');
      await moveDown(page, 1);
      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 0, y: 1},
        true,
        true,
      );
      await mergeTableCells(page);

      await moveRight(page, 1);
      await selectCellsFromTableCords(
        page,
        {x: 1, y: 0},
        {x: 2, y: 0},
        true,
        true,
      );
      await mergeTableCells(page);

      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 1, y: 0},
        true,
        true,
      );
      await mergeTableCells(page);

      await assertHTML(
        page,
        html`
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
                colspan="3"
                rowspan="2">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
            <tr><br /></tr>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
            </tr>
          </table>
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        `,
      );

      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 0, y: 0},
        true,
        true,
      );
      await unmergeTableCell(page);

      await assertHTML(
        page,
        html`
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
              <td class="PlaygroundEditorTheme__tableCell">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
            </tr>
          </table>
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        `,
      );
    },
  );

  test('Insert row above (with conflicting merged cell)', async ({
    page,
    isPlainText,
    browserName,
    isCollab,
  }) => {
    test.fixme(browserName === 'firefox');
    await initialize({isCollab, page});
    test.skip(isPlainText);
    if (IS_COLLAB) {
      // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
      page.setViewportSize({height: 1000, width: 3000});
    }

    await focusEditor(page);

    await insertTable(page, 2, 2);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await selectCellsFromTableCords(
      page,
      {x: 1, y: 0},
      {x: 1, y: 1},
      true,
      false,
    );
    await mergeTableCells(page);

    await moveLeft(page, 1);
    await insertTableRowBelow(page);

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              rowspan="3">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test('Insert column before (with conflicting merged cell)', async ({
    page,
    isPlainText,
    browserName,
    isCollab,
  }) => {
    test.fixme(browserName === 'firefox');
    await initialize({isCollab, page});
    test.skip(isPlainText);
    if (IS_COLLAB) {
      // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
      page.setViewportSize({height: 1000, width: 3000});
    }

    await focusEditor(page);

    await insertTable(page, 2, 2);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await selectCellsFromTableCords(
      page,
      {x: 0, y: 0},
      {x: 1, y: 0},
      true,
      true,
    );
    await mergeTableCells(page);

    await moveDown(page, 1);
    await moveRight(page, 1);
    await insertTableColumnBefore(page);

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              colspan="3">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test('Insert column before (with selected cell with rowspan > 1)', async ({
    page,
    isPlainText,
    browserName,
    isCollab,
  }) => {
    test.fixme(browserName === 'firefox');
    await initialize({isCollab, page});
    test.skip(isPlainText);
    if (IS_COLLAB) {
      // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
      page.setViewportSize({height: 1000, width: 3000});
    }

    await focusEditor(page);

    await insertTable(page, 2, 1);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await selectCellsFromTableCords(
      page,
      {x: 0, y: 0},
      {x: 0, y: 1},
      true,
      true,
    );
    await mergeTableCells(page);
    await insertTableColumnBefore(page);

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
              rowspan="2">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test('Insert column before (with 1+ selected cells in a row)', async ({
    page,
    isPlainText,
    browserName,
    isCollab,
  }) => {
    test.fixme(browserName === 'firefox');
    await initialize({isCollab, page});
    test.skip(isPlainText);
    if (IS_COLLAB) {
      // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
      page.setViewportSize({height: 1000, width: 3000});
    }

    await focusEditor(page);

    await insertTable(page, 2, 2);

    await click(page, '.PlaygroundEditorTheme__tableCell');
    await selectCellsFromTableCords(
      page,
      {x: 0, y: 0},
      {x: 1, y: 0},
      true,
      true,
    );
    await insertTableColumnBefore(page);

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test(
    'Delete rows (with conflicting merged cell)',
    {
      tag: '@flaky',
    },
    async ({page, isPlainText, browserName, isCollab, legacyEvents}) => {
      test.fixme(
        browserName === 'firefox' ||
          (os.platform() !== 'darwin' && browserName === 'chromium') ||
          isCollab ||
          legacyEvents,
      );
      await initialize({isCollab, page});
      test.skip(isPlainText);
      if (IS_COLLAB) {
        // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
        page.setViewportSize({height: 1000, width: 3000});
      }

      await focusEditor(page);

      await insertTable(page, 4, 2);

      await selectCellsFromTableCords(
        page,
        {x: 1, y: 1},
        {x: 1, y: 3},
        false,
        false,
      );
      await mergeTableCells(page);

      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 0, y: 1},
        true,
        true,
      );

      await deleteTableRows(page);

      await assertHTML(
        page,
        html`
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
              <td class="PlaygroundEditorTheme__tableCell" rowspan="2">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </td>
            </tr>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
          </table>
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        `,
      );
    },
  );

  test('Delete columns (with conflicting merged cell)', async ({
    page,
    isPlainText,
    browserName,
    isCollab,
    legacyEvents,
  }) => {
    test.fixme(
      browserName === 'firefox' ||
        legacyEvents ||
        (os.platform() !== 'darwin' && browserName === 'chromium'),
    );
    await initialize({isCollab, page});
    test.skip(isPlainText);
    if (IS_COLLAB) {
      // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
      page.setViewportSize({height: 1000, width: 3000});
    }

    await focusEditor(page);

    await insertTable(page, 2, 4);

    await selectCellsFromTableCords(
      page,
      {x: 1, y: 1},
      {x: 3, y: 1},
      false,
      false,
    );
    await mergeTableCells(page);

    await selectCellsFromTableCords(
      page,
      {x: 0, y: 0},
      {x: 1, y: 0},
      true,
      true,
    );

    await deleteTableColumns(page);

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <td class="PlaygroundEditorTheme__tableCell" colspan="2">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test(
    'Delete columns backward',
    {
      tag: '@flaky',
    },
    async ({page, isPlainText, browserName, isCollab, legacyEvents}) => {
      test.fixme(
        browserName === 'firefox' ||
          legacyEvents ||
          (os.platform() !== 'darwin' && browserName === 'chromium') ||
          isCollab,
      );
      await initialize({isCollab, page});
      test.skip(isPlainText);
      if (IS_COLLAB) {
        // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
        page.setViewportSize({height: 1000, width: 3000});
      }

      await focusEditor(page);

      await insertTable(page, 2, 4);

      await selectCellsFromTableCords(
        page,
        {x: 3, y: 1},
        {x: 1, y: 1},
        false,
        false,
      );

      await deleteTableColumns(page);

      await assertHTML(
        page,
        html`
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
          </table>
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        `,
      );
    },
  );

  test('Delete columns forward at end of table', async ({
    page,
    isPlainText,
    browserName,
    isCollab,
    legacyEvents,
  }) => {
    test.fixme(
      browserName === 'firefox' ||
        legacyEvents ||
        (os.platform() !== 'darwin' && browserName === 'chromium') ||
        isCollab,
    );
    await initialize({isCollab, page});
    test.skip(isPlainText);
    if (IS_COLLAB) {
      // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
      page.setViewportSize({height: 1000, width: 3000});
    }

    await focusEditor(page);

    await insertTable(page, 2, 4);

    await selectCellsFromTableCords(
      page,
      {x: 1, y: 1},
      {x: 3, y: 1},
      false,
      false,
    );

    await deleteTableColumns(page);

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test('Deselect when click outside #3785 #4138', async ({
    page,
    isPlainText,
    isCollab,
  }) => {
    await initialize({isCollab, page});
    test.skip(isPlainText);
    if (IS_COLLAB) {
      // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
      page.setViewportSize({height: 1000, width: 3000});
    }

    await focusEditor(page);

    await page.keyboard.type('123');
    await insertTable(page, 1, 1);
    await selectAll(page);

    await click(page, 'div[contenteditable="true"] p:first-of-type');

    await assertSelection(page, {
      anchorOffset: 3,
      anchorPath: [0, 0, 0],
      focusOffset: 3,
      focusPath: [0, 0, 0],
    });
  });

  test.fixme(
    'Background color to cell',
    async ({page, isPlainText, isCollab}) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);
      if (IS_COLLAB) {
        // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
        page.setViewportSize({height: 1000, width: 3000});
      }

      await focusEditor(page);

      await insertTable(page, 1, 1);
      await setBackgroundColor(page);
      await click(page, '.color-picker-basic-color button');
      await click(page, '.Modal__closeButton');

      await assertHTML(
        page,
        html`
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader"
                style="background-color: rgb(208, 2, 27)">
                <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              </th>
            </tr>
          </table>
          <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        `,
      );
    },
  );

  test.fixme(
    'Cell merge feature disabled',
    async ({page, isPlainText, isCollab}) => {
      await initialize({isCollab, page, tableCellMerge: false});
      test.skip(isPlainText);

      await focusEditor(page);
      await pasteFromClipboard(page, {
        'text/html': `<div dir="ltr">
      <table>
         <tbody>
            <tr>
               <td colspan="2" rowspan="2">
                  <p dir="ltr">Hello world</p>
               </td>
               <td>
                  <p dir="ltr">a</p>
               </td>
            </tr>
            <tr>
               <td>
                  <p dir="ltr">b</p>
               </td>
            </tr>
            <tr>
               <td>
                  <p dir="ltr">c</p>
               </td>
               <td>
                  <p dir="ltr">d</p>
               </td>
               <td>
                  <p dir="ltr">e</p>
               </td>
            </tr>
         </tbody>
      </table>
   </div>`,
      });

      await page.pause();

      await assertHTML(
        page,
        html`
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <td class="PlaygroundEditorTheme__tableCell">
                <p
                  class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                  dir="ltr">
                  <span data-lexical-text="true">Hello world</span>
                </p>
              </td>
              <td class="PlaygroundEditorTheme__tableCell"><br /></td>
              <td class="PlaygroundEditorTheme__tableCell">
                <p
                  class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                  dir="ltr">
                  <span data-lexical-text="true">a</span>
                </p>
              </td>
            </tr>
            <tr>
              <td class="PlaygroundEditorTheme__tableCell"><br /></td>
              <td class="PlaygroundEditorTheme__tableCell"><br /></td>
              <td class="PlaygroundEditorTheme__tableCell">
                <p
                  class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                  dir="ltr">
                  <span data-lexical-text="true">b</span>
                </p>
              </td>
            </tr>
            <tr>
              <td class="PlaygroundEditorTheme__tableCell">
                <p
                  class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                  dir="ltr">
                  <span data-lexical-text="true">c</span>
                </p>
              </td>
              <td class="PlaygroundEditorTheme__tableCell">
                <p
                  class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                  dir="ltr">
                  <span data-lexical-text="true">d</span>
                </p>
              </td>
              <td class="PlaygroundEditorTheme__tableCell">
                <p
                  class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                  dir="ltr">
                  <span data-lexical-text="true">e</span>
                </p>
              </td>
            </tr>
          </table>
        `,
      );
    },
  );

  test.fixme(
    'Cell background color feature disabled',
    async ({page, isPlainText, isCollab}) => {
      await initialize({isCollab, page, tableCellBackgroundColor: false});
      test.skip(isPlainText);

      await focusEditor(page);
      await pasteFromClipboard(page, {
        'text/html': `<div dir="ltr">
        <table>
           <tbody>
              <tr>
                 <td style="background-color: red">
                    <p dir="ltr">Hello world</p>
                 </td>
              </tr>
           </tbody>
        </table>
     </div>`,
      });

      await page.pause();

      await assertHTML(
        page,
        html`
          <table class="PlaygroundEditorTheme__table">
            <colgroup>
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <td class="PlaygroundEditorTheme__tableCell">
                <p
                  class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                  dir="ltr">
                  <span data-lexical-text="true">Hello world</span>
                </p>
              </td>
            </tr>
          </table>
        `,
      );
    },
  );

  test('Add column header after merging cells #4378', async ({
    page,
    isPlainText,
    browserName,
    isCollab,
    legacyEvents,
  }) => {
    test.fixme(
      browserName === 'firefox' ||
        (os.platform() !== 'darwin' && browserName === 'chromium') ||
        isCollab ||
        legacyEvents,
    );
    await initialize({isCollab, page});
    test.skip(isPlainText);
    if (IS_COLLAB) {
      // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
      page.setViewportSize({height: 1000, width: 3000});
    }

    await focusEditor(page);

    await insertTable(page, 4, 4);
    await selectCellsFromTableCords(
      page,
      {x: 1, y: 2},
      {x: 3, y: 3},
      false,
      false,
    );
    await mergeTableCells(page);
    await selectCellsFromTableCords(
      page,
      {x: 3, y: 1},
      {x: 3, y: 1},
      false,
      false,
    );
    await toggleColumnHeader(page);
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td
              class="PlaygroundEditorTheme__tableCell"
              colspan="3"
              rowspan="2">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );
  });

  test(
    'Can align text using Table selection',
    {
      tag: '@flaky',
    },
    async ({page, isPlainText, isCollab}) => {
      await initialize({isCollab, page});
      test.skip(isPlainText);

      await focusEditor(page);
      await insertTable(page, 2, 3);

      await fillTablePartiallyWithText(page);
      await selectCellsFromTableCords(
        page,
        {x: 0, y: 0},
        {x: 1, y: 1},
        true,
        false,
      );

      await selectFromAlignDropdown(page, '.center-align');

      await assertHTML(
        page,
        html`
          <p><br /></p>
          <table>
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCellSelected"
                style="text-align: center">
                <p dir="ltr" style="text-align: center">
                  <span data-lexical-text="true">a</span>
                </p>
              </th>
              <th
                class="PlaygroundEditorTheme__tableCellSelected"
                style="text-align: center">
                <p dir="ltr" style="text-align: center">
                  <span data-lexical-text="true">bb</span>
                </p>
              </th>
              <th>
                <p dir="ltr"><span data-lexical-text="true">cc</span></p>
              </th>
            </tr>
            <tr>
              <th
                class="PlaygroundEditorTheme__tableCellSelected"
                style="text-align: center">
                <p dir="ltr" style="text-align: center">
                  <span data-lexical-text="true">d</span>
                </p>
              </th>
              <td
                class="PlaygroundEditorTheme__tableCellSelected"
                style="text-align: center">
                <p dir="ltr" style="text-align: center">
                  <span data-lexical-text="true">e</span>
                </p>
              </td>
              <td>
                <p dir="ltr"><span data-lexical-text="true">f</span></p>
              </td>
            </tr>
          </table>
          <p><br /></p>
        `,
        html`
          <p><br /></p>
          <table>
            <colgroup>
              <col style="width: 92px" />
              <col style="width: 92px" />
              <col style="width: 92px" />
            </colgroup>
            <tr>
              <th style="text-align: center">
                <p dir="ltr" style="text-align: center">
                  <span data-lexical-text="true">a</span>
                </p>
              </th>
              <th style="text-align: center">
                <p dir="ltr" style="text-align: center">
                  <span data-lexical-text="true">bb</span>
                </p>
              </th>
              <th>
                <p dir="ltr"><span data-lexical-text="true">cc</span></p>
              </th>
            </tr>
            <tr>
              <th style="text-align: center">
                <p dir="ltr" style="text-align: center">
                  <span data-lexical-text="true">d</span>
                </p>
              </th>
              <td style="text-align: center">
                <p dir="ltr" style="text-align: center">
                  <span data-lexical-text="true">e</span>
                </p>
              </td>
              <td>
                <p dir="ltr"><span data-lexical-text="true">f</span></p>
              </td>
            </tr>
          </table>
          <p><br /></p>
        `,
        {ignoreClasses: true},
      );
    },
  );

  test('Paste and insert new lines after unmerging cells', async ({
    page,
    isPlainText,
    isCollab,
    browserName,
  }) => {
    test.fixme(browserName === 'firefox');
    await initialize({isCollab, page});
    test.skip(isPlainText);
    if (IS_COLLAB) {
      // The contextual menu positioning needs fixing (it's hardcoded to show on the right side)
      page.setViewportSize({height: 1000, width: 3000});
    }

    await focusEditor(page);

    await insertTable(page, 3, 3);

    await selectCellsFromTableCords(
      page,
      {x: 1, y: 1},
      {x: 2, y: 2},
      false,
      false,
    );
    await mergeTableCells(page);
    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td
              class="PlaygroundEditorTheme__tableCell"
              colspan="2"
              rowspan="2">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
        </table>
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
      `,
    );

    await unmergeTableCell(page);

    await focusEditor(page);

    // move caret to the end of the editor
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    await page.keyboard.type('Hello');
    await selectCharacters(page, 'left', 'Hello'.length);

    await withExclusiveClipboardAccess(async () => {
      const clipboard = await copyToClipboard(page);

      // move caret to the first position of the editor
      await click(page, '.PlaygroundEditorTheme__paragraph');

      // move caret to the table cell (2,2)
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');

      await pasteFromClipboard(page, clipboard);
      await pasteFromClipboard(page, clipboard);
      await pasteFromClipboard(page, clipboard);

      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');

      await pasteFromClipboard(page, clipboard);
    });

    await assertHTML(
      page,
      html`
        <p class="PlaygroundEditorTheme__paragraph"><br /></p>
        <table class="PlaygroundEditorTheme__table">
          <colgroup>
            <col style="width: 92px" />
            <col style="width: 92px" />
            <col style="width: 92px" />
          </colgroup>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
          </tr>
          <tr>
            <th
              class="PlaygroundEditorTheme__tableCell PlaygroundEditorTheme__tableCellHeader">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </th>
            <td class="PlaygroundEditorTheme__tableCell">
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
            </td>
            <td class="PlaygroundEditorTheme__tableCell">
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">HelloHelloHello</span>
              </p>
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              <p class="PlaygroundEditorTheme__paragraph"><br /></p>
              <p
                class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
                dir="ltr">
                <span data-lexical-text="true">Hello</span>
              </p>
            </td>
          </tr>
        </table>
        <p
          class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr"
          dir="ltr">
          <span data-lexical-text="true">Hello</span>
        </p>
      `,
    );
  });
});
