import Benchmark from 'benchmark';
import createCanary from '../dist/chic-modules';
import createLatest from 'chic-modules';
import react, { ComponentType } from 'react';
import styles from '../test/__mocks__/styles.module.json';
import { exec } from 'child_process';
import { renderToString } from 'react-dom/server';

function boot() {
  console.log('Fetching:', 'chic-modules@latest');

  exec('yarn upgrade chic-modules');
}

function renderComponent(Component: ComponentType) {
  renderToString(react.createElement(Component));
}

function onBenchmarkStart(event: any) {
  console.log('Starting:', event.currentTarget.name);
}

function onBenchmarkError(error: any) {
  console.log(error);
}

function onBenchmarkCycle(event: any) {
  console.log('▸', String(event.target));
}

const suite = new Benchmark.Suite('chic-modules');
const styledCanary = createCanary(styles);
const styledLatest = createLatest(styles);

suite.add('chic-modules@canary', () => renderComponent(styledCanary('h1', 'heading')));
suite.add('chic-modules@latest', () => renderComponent(styledLatest('h1', 'heading')));

suite.on('start', onBenchmarkStart);
suite.on('error', onBenchmarkError);
suite.on('cycle', onBenchmarkCycle);

boot();
suite.run();
