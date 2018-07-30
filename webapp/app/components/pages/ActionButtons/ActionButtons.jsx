import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import isEmpty from 'lodash/isEmpty';
import has from 'lodash/has';
import MsModal from '../../common/modal/MsModal';
import UsersForm from '../UsersForm/UsersForm';
import { EMAIL_REGEXP } from '../../../constants';

const EMPTY_USER = {
  name: '',
  email: '',
  phone: '',
  skypeId: ''
};

const DEFAULT_USER_MODAL_LABELS = {
  confirmButtonText: 'Save'
};

function isUserMatchById(sourceUser = {}, targetUser = {}) {
  return sourceUser['id'] === targetUser['id'];
}

function isValidUser(user) {
  return has(user, 'id') && isEmpty(user, 'id') === false;
}

class ActionButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actionType: null,
      user: {...EMPTY_USER, ...props.user},
      isUserModalOpen: false,
      modalTitle: '',
      modalBody: {},
      modalYesLabel: '',
      errors: {}
    };

    this.toggle = this.toggle.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.updateUserState = this.updateUserState.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.cancel = this.cancel.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.renderUserModalBody = this.renderUserModalBody.bind(this);
  }

  componentWillReceiveProps({ user: newUser }) {
    const { user: currentSelectedUser } = this.props;

    if (!isUserMatchById(currentSelectedUser, newUser)) {
      this.setState({
        user: {
          ...newUser
        }
      });
    }
  }

  toggle() {
    this.setState({
      isUserModalOpen: !this.state.isUserModalOpen
    });
  }

  toggleAddModal() {
    this.setState({
      actionType: 'add',
      user: { ...EMPTY_USER }
    }, this.toggle);
  }

  toggleEditModal() {
    this.setState({
      actionType: 'edit'
    }, this.toggle);
  }

  toggleDeleteModal() {
    this.setState({
      actionType: 'delete'
    }, this.toggle);
  }

  updateUserState(event) {
    this.setState({
      user: {
        ...this.state.user,
        [event.target.name]: event.target.value
      }
    });
  }

  validateForm() {
    const { user } = this.state;
    const isValidUsername = !isEmpty(user.name);
    const isValidEmail = EMAIL_REGEXP.test(user.email);
    const errors = {};

    if (!isValidUsername) {
      errors.name = 'User name is required';
    }

    if (!isValidEmail) {
      errors.email = 'Email is invalid';
    }

    this.setState({ errors });

    return errors;
  }

  canSubmitForm() {
    return isEmpty(this.validateForm());
  }

  saveUser() {
    if (!this.canSubmitForm()) {
      return;
    }

    if (typeof this.props.onConfirm === 'function') {
      this.props.onConfirm(this.state.actionType, this.state.user)
        .then(() => {
          this.toggle();
        });
    }
  }

  cancel() {
    let user = EMPTY_USER;

    if (isValidUser(this.props.user) === true) {
      user = this.props.user;
    }

    this.setState({
      user: { ...user },
      errors: {}
    }, this.toggle);
  }

  renderUserModalBody() {
    const {
      user,
      errors
    } = this.state;

    if (this.state.actionType === 'delete') {
      return (
        <p>{`Are you sure to delete User ${user.name}`}</p>
      );
    }

    return (
      <UsersForm
        onChange={this.updateUserState}
        user={user}
        errors={errors}
      />
    );
  }

  getModalLabels(actionType = 'add') {
    if (actionType === 'delete') {
      return {
        ...DEFAULT_USER_MODAL_LABELS,
        confirmButtonText: 'Delete'
      };
    }

    return DEFAULT_USER_MODAL_LABELS;
  }

  render() {
    const modalBody = this.renderUserModalBody();
    const isUserEditDisabled = isValidUser(this.state.user) === false;
    const modalInfo = {
      ...this.getModalLabels(this.state.actionType),
      title: `${this.state.actionType} User`
    };

    return (
      <div className="user-list-action-buttons">
        <Button
          color="primary"
          onClick={this.toggleAddModal}
        >Add</Button>
        <Button
          color="info"
          disabled={isUserEditDisabled}
          onClick={this.toggleEditModal}
        >Edit</Button>
        <Button
          color="danger"
          disabled={isUserEditDisabled}
          onClick={this.toggleDeleteModal}
        >Delete</Button>
        <MsModal
          okButtonLabel={modalInfo.confirmButtonText}
          cancelButtonLabel='Cancel'
          body={modalBody}
          isOpen={this.state.isUserModalOpen}
          okCallback={this.saveUser}
          cancelCallback={this.cancel}
          modalTitle={modalInfo.title}
        />
      </div>
    );
  }
}

ActionButtons.propTypes = {
  user: PropTypes.object,
  onConfirm: PropTypes.func
};

export default ActionButtons;
