# Radix UI Themes Documentation

This file contains the complete documentation for Radix UI Themes, scraped from https://www.radix-ui.com/themes/docs/

## Table of Contents

1. [Getting Started](#getting-started)
2. [Styling](#styling)
3. [Layout](#layout)
4. [Theme System](#theme-system)
5. [Components](#components)
6. [Common Issues & Solutions](#common-issues--solutions)

---

## Getting Started

Radix Themes is a pre-styled component library that is designed to work out of the box with minimal configuration. If you are looking for the unstyled components, go to [Radix Primitives](https://www.radix-ui.com/primitives).

### Installation

Getting up and running is quick and easy.

#### 1. Install Radix Themes

Install the package from your command line.

```bash
npm install @radix-ui/themes
```

#### 2. Import the CSS file

Import the global CSS file at the root of your application.

```ts
import "@radix-ui/themes/styles.css";
```

#### 3. Add the Theme component

Add `Theme` to your application, wrapping the root component inside of `body`.

```jsx
import { Theme } from "@radix-ui/themes";

export default function () {
  return (
    <html>
      <body>
        <Theme>
          <MyApp />
        </Theme>
      </body>
    </html>
  );
}
```

#### 4. Start building

You are now ready to use Radix Themes components.

```jsx
import { Flex, Text, Button } from "@radix-ui/themes";

export default function MyApp() {
  return (
    <Flex direction="column" gap="2">
      <Text>Hello from Radix Themes :)</Text>
      <Button>Let's go</Button>
    </Flex>
  );
}
```

### Customizing your theme

Configuration is managed and applied via the [Theme](https://www.radix-ui.com/themes/docs/components/theme) component.

#### Basic configuration

Pass [configuration](https://www.radix-ui.com/themes/docs/components/theme) to the `Theme` to customize appearance.

```jsx
<Theme accentColor="crimson" grayColor="sand" radius="large" scaling="95%">
  <MyApp />
</Theme>
```

#### Using the theme panel

`ThemePanel` is a drop-in component that allows you to preview the theme in real time.

```jsx
import { Theme, ThemePanel } from "@radix-ui/themes";

export default function () {
  return (
    <Theme>
      <MyApp />
      <ThemePanel />
    </Theme>
  );
}
```

---

## Styling

How to approach styling with Radix Themes.

### Introduction

Radix Themes does not come with a built-in styling system. There's no `css` or `sx` prop, and it does not use any styling libraries internally. Under the hood, it's built with vanilla CSS.

There's no overhead when it comes to picking a styling technology for your app.

### What you get

The components in Radix Themes are relatively closed—they come with a set of styles that aren't always easily overridden. They are customizable within what's allowed by their props and the theme configuration.

However, you also get access to the same CSS variables that power the Radix Themes components. You can use these tokens to create custom components that naturally feel at home in the original theme.

### Overriding styles

Beyond simple style overrides, we recommend using the components as-is, or create your own versions using the same building blocks.

Most components do have `className` and `style` props, but if you find yourself needing to override a lot of styles, it's a good sign that you should either:

- Try to achieve what you need with the existing props and theme configuration.
- See whether you can achieve your design by tweaking the underlying token system.
- Create your own component using lower-level building blocks, such [Primitives](https://www.radix-ui.com/primitives) and [Colors](https://www.radix-ui.com/colors).
- Reconsider whether Radix Themes is the right fit for your project.

#### Tailwind

Tailwind is _great_. Yet, if you plan to use Radix Themes with Tailwind, keep in mind how its ergonomics may encourage you to create complex styles on the fly, sometimes reaching into the component internals without friction.

Tailwind is a different styling paradigm, which may not mix well with the idea of a closed component system where customization is achieved through props, tokens, and creating new components on top of a shared set of building blocks.

### Custom components

If you need to create a custom component, use the same building blocks that Radix Themes uses:

- [Theme](https://www.radix-ui.com/themes/docs/theme/overview) tokens that power the components
- [Radix Primitives](https://www.radix-ui.com/primitives), a library of accessible, unstyled components
- [Radix Colors](https://www.radix-ui.com/colors), a color system for building beautiful websites and apps

---

## Layout

Get the layout concerns right.

### Layout components

Layout components are used to separate layout responsibilities from content and interactivity. This is _the_ separation of concerns that makes your app maintainable and easy to reason about.

#### Box

[Box](https://www.radix-ui.com/themes/docs/components/box) is the most fundamental layout component. Box is used to:

- Provide spacing to child elements.
- Impose sizing constraints on content.
- Control layout behaviour within flex and grid containers.
- Hide content based on screen size using its responsive `display` prop.

#### Flex

[Flex](https://www.radix-ui.com/themes/docs/components/flex) component does everything that Box can do, but comes with an additional set of props to organize items along an axis. It provides convenient access to the CSS [flexbox properties](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

#### Grid

[Grid](https://www.radix-ui.com/themes/docs/components/grid) is used to organize the content in columns and rows. Like Box and Flex, it's made to provide convenient access to the underlying CSS [grid properties](https://css-tricks.com/snippets/css/complete-guide-grid/) without any magic of its own.

#### Section

[Section](https://www.radix-ui.com/themes/docs/components/section) provides a consistent vertical spacing between the larger parts of your page content, creating a sense of hierarchy and separation.

#### Container

[Container](https://www.radix-ui.com/themes/docs/components/container)'s sole responsibility is to provide a consistent `max-width` to the content it wraps.

### Common layout props

Each layout component has a set of it's own specialized props and also a shared set of common layout props. All layout props support [responsive object values](https://www.radix-ui.com/themes/docs/theme/breakpoints).

#### Padding

Padding props can access the [space scale steps](https://www.radix-ui.com/themes/docs/theme/spacing) or accept any valid [CSS padding value](https://developer.mozilla.org/en-US/docs/Web/CSS/padding).

```jsx
<Box p="4" />
<Box p="100px" />
<Box p={{ sm: '6', lg: '9' }} />
```

| Prop | Type | Default |
| --- | --- | --- |
| `p` | `Responsive<enum \| string>` | No default value |
| `px` | `Responsive<enum \| string>` | No default value |
| `py` | `Responsive<enum \| string>` | No default value |
| `pt` | `Responsive<enum \| string>` | No default value |
| `pr` | `Responsive<enum \| string>` | No default value |
| `pb` | `Responsive<enum \| string>` | No default value |
| `pl` | `Responsive<enum \| string>` | No default value |

#### Width

Width props accept any valid [CSS width value](https://developer.mozilla.org/en-US/docs/Web/CSS/width).

```jsx
<Box width="100px" />
<Box width={{ md: '100vw', xl: '1400px' }} />
```

#### Height

Height props accept any valid [CSS height value](https://developer.mozilla.org/en-US/docs/Web/CSS/height).

```jsx
<Box height="100px" />
<Box height={{ md: '100vh', xl: '600px' }} />
```

### Margin props

Margin props are available on most components in order to provide spacing around the elements. They are not exclusive to layout components.

```jsx
<Button m="4" />
<Button m="100px" />
<Button m={{ sm: '6', lg: '9' }} />
```

### Standalone usage

If needed, it's possible to use _just_ the layout component from Radix Themes:

```jsx
import "@radix-ui/themes/layout.css";
```

---

## Common Issues & Solutions

### z-index conflicts

Out of the box, portalled Radix Themes components can be nested and stacked in any order without conflicts.

When building your own components, use the following rules to avoid z-index conflicts:

- Don't use `z-index` values other than `auto`, `0`, or `-1` in rare cases.
- Render the elements that should stack on top of each other in portals.

### Next.js import order

As of Next.js 13.0 to 14.1, the import order of CSS files in `app/**/layout.tsx` is not guaranteed, so Radix Themes may overwrite your own styles even when written correctly:

```js
import "@radix-ui/themes/styles.css";
import "./my-styles.css";
```

**Workarounds:**
- Merge all the CSS into a single file first via [postcss-import](https://github.com/postcss/postcss-import)
- Import styles directly in `page.tsx` files

### Tailwind base styles

As of Tailwind v3, styles produced by the `@tailwind` directive are usually appended after any imported CSS. Tailwind's [button reset](https://github.com/tailwindlabs/tailwindcss/blob/7361468f77500105b0559e879e121f34306e8da2/src/css/preflight.css#L197-L204) style may interfere with Radix Themes buttons.

**Workarounds:**
- Don't use `@tailwind base`
- Set up separate CSS [layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) for Tailwind and Radix Themes
- Set up [postcss-import](https://github.com/postcss/postcss-import) and manually import Tailwind base styles via `@import tailwindcss/base` before Radix Themes styles

### Missing styles in portals

When you render a custom portal in a Radix Themes project, it will naturally appear outside of the root `<Theme>` component. To fix that, wrap the portal content with another `<Theme>`:

```jsx
import { Dialog } from "radix-ui";
import { Theme } from "@radix-ui/themes";

function MyCustomDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Theme>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title />
            <Dialog.Description />
            <Dialog.Close />
          </Dialog.Content>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### Complex CSS precedence

Radix Themes provides separate `tokens.css`, `components.css`, and `utilities.css` files:

```jsx
import "@radix-ui/themes/tokens.css";
import "@radix-ui/themes/components.css";
import "@radix-ui/themes/utilities.css";
```

You can import `utilities.css` after your custom styles to ensure that the layout props work as expected.

---

## Component Categories

### Layout Components
- **Box** - Most fundamental layout component
- **Flex** - Flexbox container with layout props
- **Grid** - CSS Grid container
- **Container** - Max-width wrapper for content
- **Section** - Vertical spacing for page sections

### Typography Components  
- **Text** - Basic text rendering
- **Heading** - Heading text with semantic levels
- **Blockquote** - Quoted text blocks
- **Code** - Inline and block code
- **Em** - Emphasized text
- **Kbd** - Keyboard input styling
- **Link** - Hyperlinks
- **Quote** - Quotation marks
- **Strong** - Bold/strong text

### Interactive Components
- **Button** - Clickable buttons
- **Icon Button** - Icon-only buttons
- **Checkbox** - Checkbox inputs
- **Radio** - Radio button inputs
- **Select** - Dropdown selection
- **Switch** - Toggle switches
- **Slider** - Range sliders
- **Text Area** - Multi-line text input
- **Text Field** - Single-line text input

### Display Components
- **Avatar** - User profile pictures
- **Badge** - Status indicators
- **Card** - Content containers
- **Callout** - Highlighted content blocks
- **Progress** - Progress indicators
- **Skeleton** - Loading placeholders
- **Spinner** - Loading spinners
- **Table** - Tabular data
- **Separator** - Visual dividers

### Overlay Components
- **Alert Dialog** - Modal confirmations
- **Dialog** - Modal dialogs
- **Popover** - Floating content
- **Tooltip** - Hover information
- **Context Menu** - Right-click menus
- **Dropdown Menu** - Action menus
- **Hover Card** - Hover previews

### Navigation Components
- **Tabs** - Tab navigation
- **Tab Nav** - Link-based tabs
- **Segmented Control** - Toggle groups

### Utility Components
- **Accessible Icon** - Screen reader friendly icons
- **Portal** - Render outside normal tree
- **Reset** - CSS reset utility
- **Slot** - Component composition
- **Theme** - Theme provider
- **Visually Hidden** - Screen reader only content

---

*This documentation provides a comprehensive overview of Radix UI Themes. For the most up-to-date information and detailed component APIs, visit the official documentation at https://www.radix-ui.com/themes/docs/*