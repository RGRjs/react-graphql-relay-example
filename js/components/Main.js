import React from "react";
import Relay from "react-relay";
import {debounce} from "lodash";

import Link from "./Link";
import CreateLinkMutation from "../mutations/CreateLinkMutation";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.setVariables = debounce(this.props.relay.setVariables, 300);
  }

  search = (e) => {
    this.setVariables({ query: e.target.value });
  };

  setLimit = (e) => {
    this.setVariables({ limit: Number(e.target.value) });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let onSuccess = () => {
      $('#modal').closeModal();
    };
    let onFailure = (transaction) => {
      var error = transaction.getError() || new Error('Mutation failed.');
      console.error(error);
    };
    Relay.Store.commitUpdate(
      new CreateLinkMutation({
        title: this.refs.newTitle.value,
        url: this.refs.newUrl.value,
        store: this.props.store
      }),
      {onFailure, onSuccess}
    );
    this.refs.newTitle.value = "";
    this.refs.newUrl.value = "";
  };

  componentDidMount() {
    $('.modal-trigger').leanModal();
  }

  render() {
    let content = this.props.store.linkConnection.edges.map(edge => {
      return <Link key={edge.node.id} link={edge.node} />;
    });
    return (
      <div>
        <div className="input-field">
          <input id="search" type="text" onChange={this.search} />
          <label htmlFor="search">Search All Resources</label>
        </div>

        <div className="row">
          <a className="waves-effect waves-light btn modal-trigger right light-blue white-text" href="#modal">Add New Resource</a>
        </div>

        <ul>
          {content}
        </ul>

        <div className="row">
          <div className="col m9 s12">
            <div className="flow-text">
              <a stlye="" target="_blank" href="https://twitter.com/RGRjs">@RGRjs</a>
            </div>
          </div>
          <div className="col m3 hide-on-small-only">
            <div className="input-field">
              <select id="showing" className="browser-default"
                onChange={this.setLimit} defaultValue={this.props.relay.variables.limit}>
                <option value="100">Show 100</option>
                <option value="200">Show 200</option>
              </select>
            </div>
          </div>
        </div>

        <div id="modal" className="modal modal-fixed-footer">
          <form onSubmit={this.handleSubmit}>
            <div className="modal-content">
              <h5>Add New Resource</h5>
              <div className="input-field">
                <input type="text" id="newTitle" ref="newTitle" required className="validate" />
                <label htmlFor="newTitle">Title</label>
              </div>
              <div className="input-field">
                <input type="url" id="newUrl" ref="newUrl" required className="validate" />
                <label htmlFor="newUrl">Url</label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="waves-effect waves-green btn-flat green darken-3 white-text">
                <strong>Add</strong>
              </button>
              <a href="#!" className="modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
            </div>
          </form>
        </div>

      </div>
    );
  }
}

// Declare the data requirement for this component
Main = Relay.createContainer(Main, {
  initialVariables: {
    limit: 100,
    query: ''
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        id,
        linkConnection(first: $limit, query: $query) {
          edges {
            node {
              id,
              ${Link.getFragment('link')}
            }
          }
        }
      }
    `
  }
});

export default Main;
