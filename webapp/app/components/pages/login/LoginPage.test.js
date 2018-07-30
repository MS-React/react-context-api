import React from 'react';
import LoginPage from './LoginPage';
import { shallow } from 'enzyme';

function setup(props) {
  return shallow(<LoginPage {...props} />);
}

describe('<LoginPage /> component', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      authContext: {
        login: jest.fn
      }
    };
  });

  it('renders itself', () => {
    const wrapper = setup(defaultProps);

    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper.find('LoginForm')).toHaveLength(1);
    expect(wrapper.find('LoginForm').props()).toMatchObject({
      onSubmit: wrapper.instance().handleOnSubmit
    });
  });

  it('should call auth context login when form is submitted', () => {
    const mockLogin = jest.fn();
    defaultProps.authContext = {
      login: mockLogin
    };
    const wrapper = setup(defaultProps);

    wrapper.instance().handleOnSubmit('john', 'doe');

    expect(mockLogin).toBeCalledWith('john', 'doe');
  });
});
