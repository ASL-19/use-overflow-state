import { RefObject } from 'react';

/**
 * useOverflowState hook return value
 *
 * @public
 */
export declare interface OverflowState {
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
}

/**
 * Hook that returns the overflow state of the provided scrollable element
 * (arguments: {@link UseOverflowStateArgs})
 *
 * @public
 */
declare const useOverflowState: ({ scrollableElementRef, wrapperElementRef, }: UseOverflowStateArgs) => OverflowState;
export default useOverflowState;

/**
 * useOverflowState hook arguments
 *
 * @public
 */
export declare interface UseOverflowStateArgs {
    /**
     * Ref for the scrollable element (must have `overflow-x: auto` or
     * `overflow-x: visible`).
     */
    scrollableElementRef: RefObject<HTMLElement>;
    /**
     * Ref for the wrapper element (used to determine if scroll bar is inset).
     *
     * @remarks
     * You’ll probably want to apply the overflow indicator styles to this
     * element.
     */
    wrapperElementRef: RefObject<HTMLElement> | undefined;
}

export { }
