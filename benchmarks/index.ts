import Benchmark from 'benchmark';
import createCanary from '../dist/chic-modules.esm';
import createLatest from 'chic-modules';
import react, { FunctionComponent } from 'react';
import styles from '../test/__mocks__/styles.module.json';
import { renderToString } from 'react-dom/server';

function renderComponent(Component: FunctionComponent) {
  interface ComponentProps {
    id: string;
    hasBorder: boolean;
    hasInvalidModifier: boolean;
    isPrimary: boolean;
    withWeight: string;
  }

  const rendered = react.createElement<ComponentProps>(Component, {
    hasBorder: true,
    hasInvalidModifier: true,
    id: 'heading',
    isPrimary: true,
    withWeight: 'bold',
  });

  renderToString(rendered);
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
const classNamesArray = ['heading', 'hero'];

suite.add('chic-modules@canary', () => renderComponent(styledCanary('h1', classNamesArray)));
suite.add('chic-modules@latest', () => renderComponent(styledLatest('h1', classNamesArray)));

suite.on('start', onBenchmarkStart);
suite.on('error', onBenchmarkError);
suite.on('cycle', onBenchmarkCycle);

suite.run({ async: true });
