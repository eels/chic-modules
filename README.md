<div align="center">
  <h1>
    <br />
    <div>:sparkles:</div>
    <br />
    <div>Chic Modules</div>
    <br />
  </h1>
  <br />
  <div>A familiar styled-like API for working with css-modules in React</div>
  <br />
  <a href="https://www.npmjs.com/package/chic-modules"><img src="https://img.shields.io/npm/v/chic-modules?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/chic-modules"><img src="https://img.shields.io/npm/dm/chic-modules?style=flat-square" /></a>
  <a href="https://unpkg.com/chic-modules@latest/dist/chic-modules.mjs"><img src="https://img.badgesize.io/https://unpkg.com/chic-modules@latest/dist/chic-modules.mjs?compression=gzip&style=flat-square" /></a>
  <br /><br />
  <pre>yarn add <a href="https://www.npmjs.com/package/chic-modules">chic-modules</a></pre>
  <h1></h1>
</div>

## Motivation

I adore the styled pattern for composing React components, however, I also love css-modules and separating concerns. Life isn't all sunshine and roses though. Complex class compositions often result in ugly inline ternary operators for conditional class names and style modifiers. I wanted to create a compromise, or "best-of-both-worlds" solution, that wraps a standard css-modules implementation in a well-established API.

There are some trade-offs with a non-css-in-js solution though. Since it still outputs a build-time compiled stylesheet, runtime styles are a no-no. While preprocessors — like SCSS — go a long way to bridge that gap, they don't completely alleviate the problem. But if you don't need on-the-fly styling, or you're going to use css-modules anyway, then hopefully this can be the solution for you too!

## Contents

- [Example](#example)
- [Style Modifiers](#style-modifiers)
- [Sharing Styles](#sharing-styles)
- [Using `as`](#using-as)
- [Using `attrs`](#using-attrs)
- [Additional Styles](#additional-styles)
- [Multiple Base Class Names](#multiple-base-class-names)
- [TypeScript](#typescript)
- [Browser Support](#browser-support)
- [Badge](#badge)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Example

```scss
// application.module.css

.wrapper {
  padding: 4em;
  background: papayawhip;
}

.title {
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
}
```

```jsx
// application.jsx

import React from 'react';

import styles from './application.module.css';

import { create } from 'chic-modules';

// Call the chic-modules `create` factory and pass the
// required styles object as an argument
const styled = create(styles);

// Create a <Wrapper> React component that inherits the `.wrapper`
// class from the styles object and renders a <section> html element
const Wrapper = styled.section('wrapper');

// Create a <Title> React component that inherits the `.title`
// class from the styles object and renders a <h1> html element
const Title = styled.h1('title');

// Use them like regular React components – except they're styled!
function Application() {
  return (
    <Wrapper>
      <Title>Hello World, this is my first chic component!</Title>
    </Wrapper>
  );
}
```

This is what you'll see in your browser:

![Chic Modules example usage](https://user-images.githubusercontent.com/86960670/131226145-180aadcc-4805-409d-9a57-81d7dc94d69a.png)

[Open in CodeSandbox](https://codesandbox.io/s/brave-lewin-ofw92?file=/src/components/application.jsx)

## Style Modifiers

As I briefly touched upon in the opening Motivation statement, my biggest gripe when using css-modules is the cumbersome nature of adding "modifier" class names to components. Where I believe `chic-modules` really shines is in its attempt to solve this problem.

Taking a look at this pretty standard setup using the [classnames](https://www.npmjs.com/package/classnames) package, you can see that a lot of extra steps are required to attach conditional class names to a component. This problem only gets worse when you try to go it alone without a class name utility package.

### :no_good_woman: Cumbersome

```jsx
import classnames from 'classnames';
import styles from './button.module.css';

function Button({ children, isPrimary }) {
  const classes = classnames(
    'button',
    {
      [styles['button--primary']]: isPrimary
    }
  );

  return (
    <button classNames={classes}>{children}</button>
  );
}

<Button isPrimary />
// outputs <button class="button button--primary">
```

On the other hand, `chic-modules` can infer when a prop is being used as a style modifier and automagically add the relevant modifier class if it exists in the styles object to the component.

### :sunglasses: Chic

```jsx
import styles from './button.module.css';
import { create } from 'chic-modules';

const styled = create(styles);
const Button = styled.button('button');

<Button isPrimary />
// outputs <button class="button button--primary">
```

Any prop can be used to infer a style modifier as long as it starts with `has`, `is` or `with` and its value evaluates as truthy. You can also pass string values to props prefixed with `with` and have that value used in the constructed modifier class.

`chic-modules` expects that your styles follow the [BEM](http://getbem.com/naming/) naming convention, so when using this package ensure that your stylesheet aligns with this structure.

```jsx
<Button hasBorder isPrimary withTextColor="black" />
// outputs <button class="button button--border button--primary button--text-color-black">
```

## Sharing Styles

You can extend an existing "chic" component, or just about any component so long as it accepts the `classNames` prop, and supply it with the class names you wish to attach.

```scss
// button.module.css

.button {
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
}

.tomato-button {
  color: tomato;
  border-color: tomato;
}
```

```jsx
// button.jsx

const Button = styled.button('button');
// outputs <button class="button">

const TomatoButton = styled(Button, 'tomato-button');
// outputs <button class="button tomato-button">
```

## Using `as`

In addition, you can also override the underlying HTML element by passing the `as` prop — which accepts either a string or another component. Using another component as the value will also extend its styles, similar to the above example.

```jsx
const Button = styled.button('button');
const TomatoButton = styled.button('tomato-button');

// The component will render as a `div` element instead of a `button`
<Button as='div' />

// The component will inherit the properties of, and render as, the
// `TomatoButton` component
<Button as={TomatoButton} />
```

## Using `attrs`

Sometimes you know ahead of time that your component is always going to have the same static props, such as an input element having a `type` property. By using the `attrs` constructor you can implicitly set any static prop values that should be passed down to every instance of your "chic" component.

```jsx
const TextField = styled.input.attrs({ type: 'text' })('input-text');

// This will render with the `type` attribute implicitly set
// from the original declaration
<TextField />

// You can also locally override any attributes that are defined above
<TextField type='email' />
```

```jsx
// For extended components, you can define attributes in the same way
const EmailField = styled.attrs({ type: 'email' })(TextField, 'input-email');
```

## Additional Styles

When extending a component, you may need to reference an additional style object from the one you used during the initial `create` call. While you could use JavaScript to merge all the required objects together, `chic-modules` allows you to pass an additional style object as a final argument. This way you can keep your code clean and module structure in-tact.

```jsx
import buttonStyles from './button.module.css';
import tomatoButtonStyles from './tomato-button.module.css';
import { create } from 'chic-modules';

const styled = create(buttonStyles);
const Button = styled.button('button');
const TomatoButton = styled(Button, 'tomato-button', tomatoButtonStyles);

<Button />
// outputs <button class="button">

<TomatoButton />
// outputs <button class="button tomato-button">
```

In fact, if you prefer, you can completely omit passing a styles object to the `create` call and instead supply your styles object directly to the component construction method as required.

```jsx
import buttonStyles from './button.module.css';
import { create } from 'chic-modules';

const styled = create();
const Button = styled.button('button', buttonStyles);

<Button />
// outputs <button class="button">
```

## Multiple Base Class Names

When instantiating a "chic" component, as an alternative to passing a single class name argument, you can also supply an array of class names. This is useful when you need your component to inherit styles from multiple sources. In addition to this, any style modifying prop will apply to each base class name as long as the modifier exists in the style object.

However, if you need to apply a series of static class names, for use with a third-party library for instance, it is better to add them via the `attrs` constructor or the `className` prop instead.

```jsx
const Heading = styled.h1(['heading', 'homepage-heading']);

<Heading />
// outputs <h1 class="heading homepage-heading">

<Heading hasUnderline />
// outputs <h1 class="heading heading--underline homepage-heading homepage-heading--underline">
```

## TypeScript

`chic-modules` comes built-in with type definitions, making it super easy to get started with your TypeScript project.

If you want to ensure your "chic" components are type-safe then pass your Type Assertions in the following way:

```jsx
interface ButtonProps {
  size: 'small' | 'large';
}

const Button = styled.button<ButtonProps>('button');

// Oops! This will throw a type error because the `size` prop
// has not been defined
<Button />

// Life in beautiful type-safe harmony
<Button size='small' />
```

## Browser Support

`chic-modules` should work in all major modern browsers out-of-the-box (Chrome, Edge, Firefox, Safari).

To add support for browsers IE 11 and older, ensure you add polyfills for the following features:

- [Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#polyfill)
- [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [WeakSet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)

## Badge

Sing loud and proud! Let the world know that you're using `chic-modules`

[![styled with: chic-modules](https://img.shields.io/badge/styled%20with-%E2%9C%A8%20chic--modules-blue?style=flat-square)](https://github.com/eels/chic-modules)

```
[![styled with: chic-modules](https://img.shields.io/badge/styled%20with-%E2%9C%A8%20chic--modules-blue?style=flat-square)](https://github.com/eels/chic-modules)
```

## License

MIT - see the [LICENSE.md](https://github.com/eels/chic-modules/blob/main/LICENSE.md) file for details

## Acknowledgments

- Originally inspired by parts of the [styled-components](https://github.com/styled-components/styled-components) API
- With additional optimisation inspiration from the 1KB alternative - [goober](https://github.com/cristianbote/goober)
