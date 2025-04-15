import { RefObject, useEffect } from 'react';

export const useScrollToActiveItem = (
  containerRef: RefObject<HTMLElement  | null>,
  activeIndex: number,
  enabled: boolean
) => {
  useEffect(() => {
    if (!enabled || !containerRef.current || activeIndex < 0) return;

    const list = containerRef.current;
    const item = list.children[activeIndex] as HTMLElement;
    if (!item) return;

    const { offsetTop, offsetHeight } = item;
    const { scrollTop, clientHeight } = list;
    const scrollBottom = scrollTop + clientHeight;
    const itemBottom = offsetTop + offsetHeight;

    if (itemBottom > scrollBottom) {
      list.scrollTop = itemBottom - clientHeight;
    } else if (offsetTop < scrollTop) {
      list.scrollTop = offsetTop;
    }
  }, [containerRef, activeIndex, enabled]);
};