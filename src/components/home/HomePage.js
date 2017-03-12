import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import { Button, ButtonGroup } from 'react-bootstrap';
import Spinner from 'react-spinkit';

import * as messageActions from '../../actions/messageActions';

import Channels from './Channels';
import MessageListItem from './MessageListItem';
import MessageBox from './MessageBox';
import SelectedNone from './SelectedNone';

class HomePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      filterByStatus: 'ALL',
      messageKey: null,
      messageId: null,
    };
  }

  componentWillMount() {
    this.props.actions.messageActions.loadMessages();
  }

  handleSelectMessage(message) {
    const { id, key } = message;
    const { messageActions } = this.props.actions;

    const prevKey = this.state.messageKey;

    if(prevKey >= 0 && prevKey !== null) {
      messageActions.setIsUserResponding(prevKey, false);
      messageActions.setIsUserCommenting(prevKey, false);
    }
    messageActions.setMessageIsLoading(true);
    setTimeout(() => {
      messageActions.loadSingleMessage(id, key);
    }, this.props.delay);
    this.setState({
      messageKey: key,
      messageId: id
    });
  }

  handleFilterMessage(filterByStatus) {
    this.setState({
      filterByStatus: filterByStatus
    });
  }

  handleOverlayClick = (e) => {
    e.stopPropagation();
  }

  handleUserReplyOnKeyUp = (messageKey, e) => {
    // console.log(message);
    const { messageActions } = this.props.actions;
    if(e.target.value !== '') {
      messageActions.setIsUserResponding(messageKey, true);
    } else {
      messageActions.setIsUserResponding(messageKey, false);
    }
  }

  handleUserCommentOnKeyUp = (messageKey, e) => {
    // console.log(messageKey);
    const { messageActions } = this.props.actions;
    if(e.target.value !== '') {
      messageActions.setIsUserCommenting(messageKey, true);
    } else {
      messageActions.setIsUserCommenting(messageKey, false);
    }
  }

	render() {
    const messages = this.props.messages.data;
    const { messageId } = this.state;

    let selectedMessage = <SelectedNone text="message" />;
    if (messageId) {
      let message = [];
      message = messages
        .filter(message => {
          // console.log(message);
          if(messageId == message.id) {
            return message;
          }
        });
      selectedMessage = <MessageBox
        key={messageId}
        handleUserCommentOnKeyUp={this.handleUserCommentOnKeyUp.bind(this, message[0].key)}
        handleUserReplyOnKeyUp={this.handleUserReplyOnKeyUp.bind(this, message[0].key)}
        message={message[0]} />;
    }

	  return(
	    <div>
	      <div className="row">
          <div className="col-md-2">
            <Channels/>
          </div>
          <div className="col-md-4">
            <ButtonGroup className="messageFilters" justified>
              <Button href="#" onClick={this.handleFilterMessage.bind(this, 'UNASSIGNED')} className={this.state.filterByStatus === "UNASSIGNED" ? 'active' : ''}>Unassigned</Button>
              <Button href="#" onClick={this.handleFilterMessage.bind(this, 'OPEN')} className={this.state.filterByStatus === "OPEN" ? 'active' : ''}>Open</Button>
              <Button href="#" onClick={this.handleFilterMessage.bind(this, 'ALL')} className={this.state.filterByStatus === "ALL" ? 'active' : ''}>All</Button>
            </ButtonGroup>
            <div className="messagesBox">
              <div className={classNames('messagesLoader', {'hide': !this.props.isLoadingMessages })}><Spinner spinnerName='double-bounce' noFadeIn /></div>
              <ul className="list-unstyled messageList">
              {messages
                .filter(message => {
                  const filterBy = this.state.filterByStatus;
                  if(filterBy == 'UNASSIGNED') {
                    return !message.users ? message : '';
                  } else if(filterBy == 'OPEN') {
                    return message.status == 'OPEN' ? message : '';
                  } else {
                    return message;
                  }
                })
                .map(message => {
                  const { key, id, isUserResponding } = message;
                  return (
                    <MessageListItem
                      handleOverlayClick={this.handleOverlayClick}
                      activeMessageId={this.state.messageId}
                      messageId={id} key={key} users={message.users}
                      messageStatus={message.status} message={message}
                      handleClick={this.handleSelectMessage.bind(this, message)} />
                  );
                })
              }
              </ul>
            </div>
          </div>
          <div className="col-md-6 messageViewWrapper">
            {this.props.messages.isMessageLoading ? <Spinner spinnerName='double-bounce' noFadeIn /> : selectedMessage}
          </div>
        </div>
      </div>
    );
	}
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages,
    delay: state.delay,
    isLoadingMessages: state.messages.isLoadingMessages
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      messageActions: bindActionCreators(messageActions, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
