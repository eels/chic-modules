import htmlAttributes from 'html-attributes';
import svgAttributes from 'svg-attributes';

const reactAttributes = {
  autoFocus: true,
  children: true,
  dangerouslySetInnerHTML: true,
  defaultChecked: true,
  defaultValue: true,
  innerHTML: true,
  key: true,
  ref: true,
  suppressContentEditableWarning: true,
  suppressHydrationWarning: true,
  valueLink: true,
};

export const ATTRIBUTES = Object.assign({}, htmlAttributes, reactAttributes, svgAttributes);
