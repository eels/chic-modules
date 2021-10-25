import { cssPropertyAlias, cssPropertyPrefixFlags, cssValuePrefixFlags } from 'style-vendorizer';

export default function prefixCSSDeclaration(property: string, value: any) {
  const output = <string[]>[];
  const vendorFlags = { 0b001: '-webkit-', 0b010: '-moz-', 0b100: '-ms-' };
  const vendorFlagEntries = Object.entries(vendorFlags);

  const hasPropertyAlias = cssPropertyAlias(property);
  const hasPropertyFlags = cssPropertyPrefixFlags(property);
  const hasCSSValueFlags = cssValuePrefixFlags(property, value);

  if (hasPropertyAlias) {
    output.push(`${hasPropertyAlias}:${value};`);
  }

  for (const [bit, vendor] of vendorFlagEntries) {
    const bitnum = parseInt(bit);

    if (hasPropertyFlags & bitnum) {
      output.push(`${vendor}${property}:${value};`);
    }

    if (hasCSSValueFlags & bitnum) {
      output.push(`${property}:${vendor}${value};`);
    }
  }

  output.push(`${property}:${value};`);

  return output.join('');
}
