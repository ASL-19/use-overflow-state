[**@asl-19/use-overflow-state**](../README.md)

***

[@asl-19/use-overflow-state](../README.md) / UseOverflowStateArgs

# Type Alias: UseOverflowStateArgs

> **UseOverflowStateArgs** = `object`

useOverflowState hook arguments

## Properties

### roundingErrorTolerance?

> `optional` **roundingErrorTolerance?**: `number`

Number of pixels of tolerance to account for rounding errors in
`hasOverflow` calculations.

#### Remarks

Set to `2` by default since we’ve observed subpixel `normalizedScrollLeft`
values greater than `1` (e.g. `1.047607421875`) when scrolled to the edge of
a container in Chrome on Android.

***

### scrollableElementRef

> **scrollableElementRef**: `RefObject`\<`HTMLElement` \| `null`\>

Ref for the scrollable element (must have `overflow-x: auto` or
`overflow-x: visible`).

***

### wrapperElementRef

> **wrapperElementRef**: `RefObject`\<`HTMLElement` \| `null`\>

Ref for the wrapper element (used to determine if scroll bar is inset).

#### Remarks

You’ll probably want to apply the overflow indicator styles to this
element.
