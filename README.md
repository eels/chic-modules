<div align="center">
  <h1>
    <br />
    <div>:sparkles:</div>
    <br />
    <div>Chic Modules</div>
    <br />
  </h1>
  <br />
  <div>A familiar styled-like api for working with css-modules in React</div>
  <br />
  <a href="https://www.npmjs.com/package/chic-modules"><img src="https://img.shields.io/npm/v/chic-modules?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/chic-modules"><img src="https://img.shields.io/npm/dm/chic-modules?style=flat-square" /></a>
  <a href="https://unpkg.com/chic-modules@latest/dist/chic-modules.esm.js"><img src="https://img.badgesize.io/https:/unpkg.com/chic-modules@latest/dist/chic-modules.esm.js?compression=gzip&style=flat-square" /></a>
  <br /><br />
  <pre>yarn add <a href="https://www.npmjs.com/package/chic-modules">chic-modules</a></pre>
  <h1></h1>
</div>

## Motivation

I adore the styled pattern for composing React components, however, I also love css-modules and separating concerns. Life isn't all sunshine and roses though. Complex class composition often result in ugly inline ternary operators for conditional class names and style modifiers. I wanted to create a compromise, or "best-of-both-worlds" solution, that wraps a standard css-modules implementation in a well-established api.

There are some trade-offs with a non-css-in-js solution though. Since it still outputs a build-time compiled stylesheet, runtime styles are a no-no. While preprocessors — like SCSS — go a long way to bridge that gap, they don't completely alleviate the problem. But if you don't need on-the-fly styling, or you're going to use css-modules anyway, then hopefully this can be the solution for you too!

## Example

```scss
// application.css

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

import create from 'chic-modules';

import styles from './application.css';

// Call the chic-modules `create` factory and pass the
// required styles object as an argument
const styled = create(styles);

// Create a <Wrapper> react component that inherits the `.wrapper`
// class from the styles object and renders a <section> html element
const Wrapper = styled.section('wrapper');

// Create a <Title> react component that inherits the `.title`
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

## Badge

Sing loud and proud! Let the world know that you're using **chic-modules**

[![styled with: chic-modules](https://img.shields.io/badge/styled%20with-%E2%9C%A8%20chic--modules-blue?style=flat-square)](https://github.com/eels/chic-modules)

```
[![styled with: chic-modules](https://img.shields.io/badge/styled%20with-%E2%9C%A8%20chic--modules-blue?style=flat-square)](https://github.com/eels/chic-modules)
```

## License

MIT - see the [LICENSE.md](https://github.com/eels/chic-modules/blob/main/LICENSE.md) file for details

## Acknowledgments

- Originally inspired by parts of the [styled-components](https://github.com/styled-components/styled-components) API
- With additional optimisation inspiration from the 1KB alternative - [goober](https://github.com/cristianbote/goober)
