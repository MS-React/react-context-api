import React from 'react';
import Header from './../partials/header/Header';
import ActionButtons from '../ActionButtons/ActionButtons';
import BootstrapTable from 'react-bootstrap-table-next';
import PropTypes from 'prop-types';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Col, Row } from 'reactstrap';
import { get } from 'lodash';
import './HomePage.css';

class HomePage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedRow: [],
      users: get(props.usersContext, 'data', [])
    };

    this.setSelectedRow = this.setSelectedRow.bind(this);
    this.handleUserActionType = this.handleUserActionType.bind(this);
  }

  componentDidMount() {
    if (this.props.usersContext && this.props.usersContext.getUsers) {
      this.props.usersContext.getUsers();
    }
  }

  setSelectedRow(user) {
    this.setState({
      selectedRow: [user.id]
    }, () => {
      if (this.props.usersContext && this.props.usersContext.selectUser) {
        this.props.usersContext.selectUser(user);
      }
    });
  }

  handleUserActionType(type = 'add', user) {
    const usersContext = this.props.usersContext;

    switch(type) {
      case 'add':
        return usersContext.createUser(user);
      case 'edit':
        return usersContext.updateUser(user);
      case 'delete':
        return usersContext.deleteUser(user);
      default:
        throw new TypeError(`Unhandled User Action Type ${type}`);
    }
  }

  getColumnsProp() {
    return [{
      dataField: 'name',
      text: 'Full Name'
    }, {
      dataField: 'email',
      text: 'Email'
    }, {
      dataField: 'phone',
      text: 'Phone Number'
    }];
  }

  getSelectRowProp() {
    return {
      mode: 'radio',
      clickToSelect: true,
      bgColor: '#C8E6C9',
      selected: this.state.selectedRow,
      onSelect: this.setSelectedRow
    };
  }

  getBootstrapTableProps () {
    return {
      columns: this.getColumnsProp(),
      data: this.props.usersContext.data,
      keyField: 'id',
      selectRow: this.getSelectRowProp(),
      pagination: paginationFactory()
    };
  }

  render() {
    // I was trying to implement consumer here but we can have problems
    // with the bind function handleUserActionType we need initialized context
    // in the initial state
    return (
      <div>
        <Header />
        <div className="container">
          <Row>
            <Col md="8">
              <h4>Users List</h4>
            </Col>
            <Col md="4">
              <ActionButtons
                user={this.props.usersContext.selectedUser}
                onConfirm={this.handleUserActionType}
              />
            </Col>
          </Row>
          <BootstrapTable {...this.getBootstrapTableProps()} />
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  usersContext: PropTypes.object.isRequired
};

export default HomePage;
