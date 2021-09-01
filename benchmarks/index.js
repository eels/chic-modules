import Benchmark from 'benchmark';
import createCanary from '../dist/chic-modules.cjs';
import createLatest from '../node_modules/chic-modules/dist/chic-modules.cjs';
import fs from 'fs';
import react from 'react';
import { renderToString } from 'react-dom/server.js';

function renderComponent(Component) {
  const rendered = react.createElement(Component, {
    hasBorder: true,
    hasInvalidModifier: true,
    id: 'heading',
    isPrimary: true,
    withWeight: 'bold',
  });

  renderToString(rendered);
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
const classNamesArray = ['heading', 'hero'];

suite.add('chic-modules@canary', () => renderComponent(styledCanary('h1', classNamesArray)));
suite.add('chic-modules@latest', () => renderComponent(styledLatest('h1', classNamesArray)));

suite.on('start', onBenchmarkStart);
suite.on('error', onBenchmarkError);
suite.on('cycle', onBenchmarkCycle);

suite.run({ async: true });
