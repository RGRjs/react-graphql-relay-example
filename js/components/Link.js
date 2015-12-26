import React from "react";
import Relay from "react-relay";
import moment from "moment";

class Link extends React.Component {
  dateStyle = () => ({
    color: '#888',
    fontSize: '0.7em',
    marginRight: '0.5em'
  })
  urlStyle = () => ({
    color: '#062',
    fontSize: '0.85em'
  })
  dateLabel = () => {
    let {link, relay} = this.props;
    if (relay.hasOptimisticUpdate(link)) {
      return 'Saving...';
    }
    return moment(link.createdAt).format('L')
  }
  url = () => {
    return this.props.link.url.replace(/^https?:\/\/|\/$/ig,'');
  }
  render() {
    let {link} = this.props;
    return (
      <li>
        <div className="card-panel" style={{padding: '1em'}}>
          <a href={link.url}>{link.title}</a>
          <div className="truncate">
            <span style={this.dateStyle()}>
              {this.dateLabel()}
            </span>
            <a href={link.url} style={this.urlStyle()}>
              {this.url()}
            </a>
          </div>
        </div>
      </li>
    );
  }
}

Link = Relay.createContainer(Link, {
  fragments: {
    link: () => Relay.QL`
      fragment on Link {
        url,
        title,
        createdAt,
      }
    `
  }
});

export default Link;

