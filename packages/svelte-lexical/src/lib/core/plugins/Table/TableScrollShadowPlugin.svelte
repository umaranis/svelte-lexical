<script lang="ts">
  import {getEditor} from '$lib/core/composerContext.js';
  import {getThemeSelector} from '../util/getThemeSelector.js';

  const editor = getEditor();

  $effect(() => {
    const editorElement = editor.getRootElement();
    const theme = editor._config.theme;
    const wrapperSelector = getThemeSelector(theme.tableScrollableWrapper);
    if (!editorElement || !wrapperSelector) {
      return;
    }
    const scrollRightClass: string | undefined = theme.tableScrollRight;
    const scrollLeftClass: string | undefined = theme.tableScrollLeft;
    const scrollMiddleClass: string | undefined = theme.tableScrollMiddle;

    const updateTableScrollState = (element: HTMLElement): void => {
      const hasScroll = element.scrollWidth > element.clientWidth;
      // Adding and removing 1 and -1 for floating point precision
      const isScrolledToRight =
        element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;
      const isScrolledToLeft = element.scrollLeft <= 1;

      // Remove all scroll classes first
      for (const cls of [
        scrollRightClass,
        scrollLeftClass,
        scrollMiddleClass,
      ]) {
        if (cls) {
          element.classList.remove(cls);
        }
      }

      let cls: string | undefined;
      if (hasScroll) {
        // Middle state: not at either edge
        if (!isScrolledToLeft && !isScrolledToRight) {
          cls = scrollMiddleClass;
        }
        // Right edge
        else if (isScrolledToLeft && !isScrolledToRight) {
          cls = scrollRightClass;
        }
        // Left edge
        else if (!isScrolledToLeft && isScrolledToRight) {
          cls = scrollLeftClass;
        }
      }
      if (cls) {
        element.classList.add(cls);
      }
    };

    const updateAllTableScrollStates = () => {
      const wrappers =
        editorElement.querySelectorAll<HTMLElement>(wrapperSelector);
      wrappers.forEach(updateTableScrollState);
    };

    // Initial check
    updateAllTableScrollStates();

    // Watch for new table wrappers being added
    const observer = new MutationObserver(() => {
      updateAllTableScrollStates();
    });

    observer.observe(editorElement, {
      childList: true,
      subtree: true,
    });

    // Also watch for resize events on the wrappers themselves
    const resizeObserver = new ResizeObserver(() => {
      updateAllTableScrollStates();
    });

    const scrollHandlers = new Map<HTMLElement, () => void>();

    const addScrollListener = (wrapper: HTMLElement) => {
      if (scrollHandlers.has(wrapper)) {
        return; // Already has a listener
      }
      const handler = () => {
        updateTableScrollState(wrapper);
      };
      wrapper.addEventListener('scroll', handler, {passive: true});
      scrollHandlers.set(wrapper, handler);
    };

    const wrappers =
      editorElement.querySelectorAll<HTMLElement>(wrapperSelector);
    wrappers.forEach((wrapper) => {
      resizeObserver.observe(wrapper);
      addScrollListener(wrapper);
    });

    // Watch for new wrappers to observe
    const wrapperObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches(wrapperSelector)) {
              resizeObserver.observe(node);
              addScrollListener(node);
              updateTableScrollState(node);
            }

            const childWrappers =
              node.querySelectorAll<HTMLElement>(wrapperSelector);
            childWrappers.forEach((wrapper) => {
              resizeObserver.observe(wrapper);
              addScrollListener(wrapper);
              updateTableScrollState(wrapper);
            });
          }
        });
      });
    });

    wrapperObserver.observe(editorElement, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      wrapperObserver.disconnect();

      scrollHandlers.forEach((handler, wrapper) => {
        wrapper.removeEventListener('scroll', handler);
      });
      scrollHandlers.clear();
    };
  });
</script>
