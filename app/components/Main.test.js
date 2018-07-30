import React from 'react';
import Main from './Main';
import { MemoryRouter } from 'react-router';
import { mount } from 'enzyme';

function setup(entries) {
  return mount(
    <MemoryRouter initialEntries={entries}>
      <Main />
    </MemoryRouter>
  );
}

describe('<Main /> component', () => {

  it('renders itself', () => {
    const wrapper = setup(['/test']);

    expect(wrapper.find('Switch')).toHaveLength(1);
    expect(wrapper.find('Route')).toHaveLength(1);
  });

  it('should render not found component', () => {
    const wrapper = setup(['/not-found']);

    expect(wrapper.find('Switch')).toHaveLength(1);
    expect(wrapper.find('Route')).toHaveLength(1);
    expect(wrapper.find('NotFoundPage')).toHaveLength(1);
  });

  /**
   * Today with consumer enzyme has a bug:
   * Enzyme Internal Error: unknown node with tag 12
   * Enzyme Internal Error: unknown node with tag 13
   * Reference: https://github.com/Khan/wonder-blocks/pull/162
   *
   * it('should render home page component', () => {
   *   const wrapper = setup(['/']);
   *
   *   expect(wrapper.find('Switch')).toHaveLength(1);
   *   expect(wrapper.find('Route')).toHaveLength(1);
   *   expect(wrapper.find('HomePage')).toHaveLength(1);
   * });
   *
   */
});
