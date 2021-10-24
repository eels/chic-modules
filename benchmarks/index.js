import Benchmark from 'benchmark';
import React from 'react';
import fs from 'fs';
import { create as createCanary } from '../dist/chic-modules.cjs';
import { create as createLatest } from '../node_modules/chic-modules/dist/chic-modules.cjs';
import { renderToString } from 'react-dom/server.js';

function renderComponent(Component) {
  const component = React.createElement(Component, {
    isPrimary: true,
    styles: { padding: `${Math.random()}px` },
  });

  renderToString(component);
}

function onBenchmarkStart(event) {
  console.log('Starting:', event.currentTarget.name);
}

function onBenchmarkError(error) {
  console.log(error);
}

function onBenchmarkCycle(event) {
  console.log('▸', String(event.target));
}

const suite = new Benchmark.Suite('chic-modules');
const styles = JSON.parse(fs.readFileSync('./test/__mocks__/styles.module.json'));
const styledCanary = createCanary(styles);
const styledLatest = createLatest(styles);

suite.add('chic-modules@canary', () => renderComponent(styledCanary('h1', 'heading')));
suite.add('chic-modules@latest', () => renderComponent(styledLatest('h1', 'heading')));

suite.on('start', onBenchmarkStart);
suite.on('error', onBenchmarkError);
suite.on('cycle', onBenchmarkCycle);

suite.run({ async: true });
