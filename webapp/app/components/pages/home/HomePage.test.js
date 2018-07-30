import React from 'react';
import HomePage from './HomePage';
import BootstrapTable from 'react-bootstrap-table-next';
import { shallow } from 'enzyme';
import { stub } from 'sinon';

function setup(props) {
  return shallow(<HomePage {...props} />);
}

describe('<HomePage /> component', () => {
  let defaultProps;
  let getUsersStub = stub();
  let createUserStub = stub();
  let updateUserStub = stub();
  let deleteUserStub = stub();
  let selectUserStub = stub();

  beforeEach(() => {
    getUsersStub.reset();
    createUserStub.reset();
    updateUserStub.reset();
    deleteUserStub.reset();
    selectUserStub.reset();

    defaultProps = {
      usersContext: {
        data: [],
        fetch: {
          loading: false,
          error: null
        },
        selectedUser: {},
        getUsers: jest.fn,
        createUser: jest.fn,
        updateUser: jest.fn,
        deleteUser: jest.fn,
        selectUser: jest.fn
      }
    };
  });

  it('renders itself', () => {
    const wrapper = setup(defaultProps);

    expect(wrapper.find('Header')).toHaveLength(1);
    expect(wrapper.find('.container')).toHaveLength(1);
    expect(wrapper.find('.container h4').text()).toEqual('Users List');
    expect(wrapper.find('ActionButtons')).toHaveLength(1);
    expect(wrapper.find('ActionButtons').props()).toMatchObject({
      user: {},
      onConfirm: wrapper.instance().handleUserActionType
    });
    expect(wrapper.find(BootstrapTable)).toHaveLength(1);
    expect(wrapper.find(BootstrapTable).props()).toMatchObject({
      columns: wrapper.instance().getColumnsProp(),
      data: [],
      keyField: 'id',
      selectRow:  wrapper.instance().getSelectRowProp()
    });
  });

  it('should call get users prop when component is mounted', () => {
    defaultProps.usersContext.getUsers = getUsersStub;
    const wrapper = shallow(<HomePage {...defaultProps} />);

    expect(getUsersStub.calledOnce).toBeTruthy();
  });

  it('should call create users prop when action button type is add', () => {
    defaultProps.usersContext.createUser = createUserStub;
    const wrapper = shallow(<HomePage {...defaultProps} />);
    wrapper.find('ActionButtons').prop('onConfirm')('add', {
      _id: '_id',
      name: 'John Doe'
    });

    expect(createUserStub.calledWith({
      _id: '_id',
      name: 'John Doe'
    })).toBeTruthy();
  });

  it('should call create users prop when action button type is edit', () => {
    defaultProps.usersContext.updateUser = updateUserStub;
    const wrapper = shallow(<HomePage {...defaultProps} />);
    wrapper.find('ActionButtons').prop('onConfirm')('edit', {
      _id: '_id',
      name: 'John Doe'
    });

    expect(updateUserStub.calledWith({
      _id: '_id',
      name: 'John Doe'
    })).toBeTruthy();
  });

  it('should call create users prop when action button type is delete', () => {
    defaultProps.usersContext.deleteUser = deleteUserStub;
    const wrapper = shallow(<HomePage {...defaultProps} />);
    wrapper.find('ActionButtons').prop('onConfirm')('delete', {
      _id: '_id',
      name: 'John Doe'
    });

    expect(deleteUserStub.calledWith({
      _id: '_id',
      name: 'John Doe'
    })).toBeTruthy();
  });

  it('should not call users context when action button type is not present', () => {
    defaultProps.usersContext.createUser = createUserStub;
    defaultProps.usersContext.updateUser = updateUserStub;
    defaultProps.usersContext.deleteUser = deleteUserStub;

    const wrapper = shallow(<HomePage {...defaultProps} />);

    try {
      wrapper.find('ActionButtons').prop('onConfirm')('test', {
        _id: '_id',
        name: 'John Doe'
      });
    } catch (e) {
      expect(createUserStub.notCalled).toBeTruthy();
      expect(updateUserStub.notCalled).toBeTruthy();
      expect(deleteUserStub.notCalled).toBeTruthy();
      expect(e.message).toEqual('Unhandled User Action Type test');
    }
  });

  it('should call select user context when row table is clicked', () => {
    defaultProps.usersContext.selectUser = selectUserStub;
    const wrapper = shallow(<HomePage {...defaultProps} />);

    wrapper.instance().setSelectedRow({
      id: 'id',
      name: 'John Doe'
    });

    expect(wrapper.state('selectedRow')).toEqual(['id']);
    expect(selectUserStub.calledWith({
      id: 'id',
      name: 'John Doe'
    })).toBeTruthy();
  });
});
