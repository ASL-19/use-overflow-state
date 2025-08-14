import { supportsPassiveEvents } from "detect-passive-events";
import { getNormalizedScrollLeft } from "normalize-scroll-left";
import { RefObject, useEffect, useRef, useState } from "react";

// =============
// === Types ===
// =============

/**
 * useOverflowState hook return value
 *
 * @public
 */
export type OverflowState = {
  /**
   * Does the horizontal scroll bar have a gutter (reserved space)?
   *
   * @remarks
   * Overlay scroll bars will never have a gutter; classic scroll bars will have
   * a gutter if the scrollable element has overflow.
   */
  horizontalScrollBarHasGutter: boolean;

  /**
   * Is there overflow on the left side?
   */
  leftHasOverflow: boolean;

  /**
   * Is there overflow on the right side?
   */
  rightHasOverflow: boolean;
};

/**
 * useOverflowState hook arguments
 *
 * @public
 */
export type UseOverflowStateArgs = {
  /**
   * Number of pixels of tolerance to account for rounding errors in
   * `hasOverflow` calculations.
   *
   * @remarks
   * Set to `2` by default since we’ve observed subpixel `normalizedScrollLeft`
   * values greater than `1` (e.g. `1.047607421875`) when scrolled to the edge of
   * a container in Chrome on Android.
   */
  roundingErrorTolerance?: number;

  /**
   * Ref for the scrollable element (must have `overflow-x: auto` or
   * `overflow-x: visible`).
   */
  scrollableElementRef: RefObject<HTMLElement | null>;

  /**
   * Ref for the wrapper element (used to determine if scroll bar is inset).
   *
   * @remarks
   * You’ll probably want to apply the overflow indicator styles to this
   * element.
   */
  wrapperElementRef: RefObject<HTMLElement | null>;
};

type DocumentDir = "ltr" | "rtl";

// =================
// === Constants ===
// =================

const overflowStateKeys: Array<keyof OverflowState> = [
  "leftHasOverflow",
  "rightHasOverflow",
  "horizontalScrollBarHasGutter",
];

const scrollPositionUpdateFrequency = 125;

// ============
// === Hook ===
// ============

/**
 * Hook that returns the overflow state of the provided scrollable element
 * (arguments: {@link UseOverflowStateArgs})
 *
 * @public
 */
const useOverflowState = ({
  roundingErrorTolerance = 2,
  scrollableElementRef,
  wrapperElementRef,
}: UseOverflowStateArgs): OverflowState => {
  const [overflowState, setOverflowState] = useState<OverflowState>({
    horizontalScrollBarHasGutter: false,
    leftHasOverflow: false,
    rightHasOverflow: false,
  });

  const updateScrollStateTimeoutIdRef = useRef<number>(0);
  const lastScrollPositionUpdateUnixTimeRef = useRef<number>(0);

  useEffect(() => {
    const documentDir: DocumentDir = document.documentElement.getAttribute(
      "dir",
    ) as DocumentDir;

    const wrapperElement = wrapperElementRef.current;
    const scrollableElement = scrollableElementRef.current;

    const updateOverflowState = () => {
      if (!wrapperElement || !scrollableElement) {
        return;
      }

      const normalizedScrollLeft = getNormalizedScrollLeft(
        scrollableElement,
        documentDir,
      );

      const leftHasOverflow = normalizedScrollLeft > roundingErrorTolerance;

      const rightHasOverflow =
        // Math.ceil necessary because scrollLeft can be a decimal
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
        normalizedScrollLeft +
          scrollableElement.offsetWidth +
          roundingErrorTolerance <
        scrollableElement.scrollWidth;

      const scrollBarIsInset =
        wrapperElement.clientHeight > scrollableElement.clientHeight;

      const newOverflowState: OverflowState = {
        horizontalScrollBarHasGutter: scrollBarIsInset,
        leftHasOverflow,
        rightHasOverflow,
      };

      if (
        overflowStateKeys.some(
          (key) => overflowState[key] !== newOverflowState[key],
        )
      ) {
        setOverflowState({
          horizontalScrollBarHasGutter: scrollBarIsInset,
          leftHasOverflow,
          rightHasOverflow,
        });
      }
    };

    const debouncedUpdateOverflowState = () => {
      window.clearTimeout(updateScrollStateTimeoutIdRef.current);

      const currentUnixTime = Date.now();

      if (
        scrollPositionUpdateFrequency >
        currentUnixTime - lastScrollPositionUpdateUnixTimeRef.current
      ) {
        updateScrollStateTimeoutIdRef.current = window.setTimeout(
          updateOverflowState,
          scrollPositionUpdateFrequency,
        );

        return;
      }

      updateOverflowState();

      lastScrollPositionUpdateUnixTimeRef.current = currentUnixTime;
    };

    updateOverflowState();

    if (scrollableElement) {
      scrollableElement.addEventListener(
        "scroll",
        debouncedUpdateOverflowState,
        supportsPassiveEvents ? { passive: true } : false,
      );
    }

    window.addEventListener("resize", debouncedUpdateOverflowState, false);

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener(
          "scroll",
          debouncedUpdateOverflowState,
          false,
        );
      }

      window.removeEventListener("resize", debouncedUpdateOverflowState, false);
    };
  }, [
    overflowState,
    roundingErrorTolerance,
    scrollableElementRef,
    wrapperElementRef,
  ]);

  return overflowState;
};

export default useOverflowState;
