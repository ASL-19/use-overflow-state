import { act, fireEvent, renderHook } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, expect, test, vi } from "vitest";

import useOverflowState from "./index.js";

// happy-dom doesn’t do layout, so the scrollable element’s dimensions and
// scroll position are mocked. Mutate the returned dimensions, then dispatch a
// scroll event to simulate scrolling.
const setUp = ({
  roundingErrorTolerance,
  scrollableClientHeight = 100,
  scrollLeft = 0,
  scrollWidth = 200,
  wrapperClientHeight = 100,
}: {
  roundingErrorTolerance?: number;
  scrollableClientHeight?: number;
  scrollLeft?: number;
  scrollWidth?: number;
  wrapperClientHeight?: number;
}) => {
  const wrapper = document.createElement("div");
  const scrollable = document.createElement("div");

  wrapper.append(scrollable);
  document.body.append(wrapper);

  const dimensions = { scrollLeft, scrollWidth };
  const getScrollLeft = vi.fn(() => dimensions.scrollLeft);

  Object.defineProperties(scrollable, {
    clientHeight: { get: () => scrollableClientHeight },
    offsetWidth: { get: () => 100 },
    scrollLeft: { get: getScrollLeft },
    scrollWidth: { get: () => dimensions.scrollWidth },
  });
  Object.defineProperty(wrapper, "clientHeight", {
    get: () => wrapperClientHeight,
  });

  const { result, unmount } = renderHook(() => {
    const scrollableElementRef = useRef<HTMLDivElement>(null);
    const wrapperElementRef = useRef<HTMLDivElement>(null);

    scrollableElementRef.current = scrollable;
    wrapperElementRef.current = wrapper;

    return useOverflowState({
      roundingErrorTolerance,
      scrollableElementRef,
      wrapperElementRef,
    });
  });

  return { dimensions, getScrollLeft, result, scrollable, unmount };
};

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

test("reports no overflow if content fits", () => {
  const { result } = setUp({ scrollWidth: 100 });

  expect(result.current).toEqual({
    horizontalScrollBarHasGutter: false,
    leftHasOverflow: false,
    rightHasOverflow: false,
  });
});

test("reports right overflow when scrolled to the start", () => {
  const { result } = setUp({ scrollLeft: 0 });

  expect(result.current.leftHasOverflow).toBe(false);
  expect(result.current.rightHasOverflow).toBe(true);
});

test("reports left and right overflow when scrolled to the middle", () => {
  const { result } = setUp({ scrollLeft: 50 });

  expect(result.current.leftHasOverflow).toBe(true);
  expect(result.current.rightHasOverflow).toBe(true);
});

test("reports left overflow when scrolled to the end", () => {
  const { result } = setUp({ scrollLeft: 100 });

  expect(result.current.leftHasOverflow).toBe(true);
  expect(result.current.rightHasOverflow).toBe(false);
});

test("ignores overflow within roundingErrorTolerance", () => {
  expect(setUp({ scrollLeft: 1.5 }).result.current.leftHasOverflow).toBe(false);
  expect(setUp({ scrollLeft: 98.5 }).result.current.rightHasOverflow).toBe(
    false,
  );
  expect(
    setUp({ roundingErrorTolerance: 0, scrollLeft: 1.5 }).result.current
      .leftHasOverflow,
  ).toBe(true);
});

test("reports a horizontal scroll bar gutter if the wrapper is taller than the scrollable element", () => {
  const { result } = setUp({
    scrollableClientHeight: 85,
    wrapperClientHeight: 100,
  });

  expect(result.current.horizontalScrollBarHasGutter).toBe(true);
});

test("updates on scroll", () => {
  const { dimensions, result, scrollable } = setUp({ scrollLeft: 0 });

  dimensions.scrollLeft = 100;
  act(() => {
    fireEvent.scroll(scrollable);
  });

  expect(result.current.leftHasOverflow).toBe(true);
  expect(result.current.rightHasOverflow).toBe(false);
});

test("throttles updates to every 125 ms", () => {
  vi.useFakeTimers();

  const { dimensions, result, scrollable } = setUp({ scrollLeft: 0 });

  act(() => {
    fireEvent.scroll(scrollable);
  });

  dimensions.scrollLeft = 100;
  act(() => {
    fireEvent.scroll(scrollable);
  });

  expect(result.current.leftHasOverflow).toBe(false);

  act(() => {
    vi.advanceTimersByTime(125);
  });

  expect(result.current.leftHasOverflow).toBe(true);
});

test("updates on window resize", () => {
  const { dimensions, result } = setUp({ scrollLeft: 0 });

  dimensions.scrollWidth = 100;
  act(() => {
    fireEvent(window, new Event("resize"));
  });

  expect(result.current.rightHasOverflow).toBe(false);
});

test("doesn’t update after unmount", () => {
  vi.useFakeTimers();

  const { getScrollLeft, scrollable, unmount } = setUp({ scrollLeft: 0 });

  act(() => {
    fireEvent.scroll(scrollable);
  });
  act(() => {
    fireEvent.scroll(scrollable);
  });

  unmount();
  getScrollLeft.mockClear();

  vi.advanceTimersByTime(125);
  fireEvent.scroll(scrollable);
  fireEvent(window, new Event("resize"));

  expect(getScrollLeft).not.toHaveBeenCalled();
});
