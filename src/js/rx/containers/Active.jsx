import React from 'react';
import { connect } from 'react-redux';

import { loadPrescriptions, sortPrescriptions } from '../actions/prescriptions';
import { openRefillModal } from '../actions/modals';
import PrescriptionList from '../components/PrescriptionList';
import SortMenu from '../components/SortMenu';
import { sortOptions } from '../config';

class Active extends React.Component {
  constructor(props) {
    super(props);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    this.props.loadPrescriptions({ active: true });
  }

  componentDidUpdate() {
    const newSort = this.props.location.query.sort;
    const oldSort = this.props.sort;

    if (newSort !== oldSort) {
      this.props.sortPrescriptions(newSort);
    }
  }

  handleSort(sort) {
    this.context.router.push({
      ...this.props.location,
      query: { sort }
    });
  }

  render() {
    const prescriptions = this.props.prescriptions;
    let content;

    if (prescriptions) {
      const sortValue = this.props.sort;

      content = (
        <div>
          <SortMenu
              onChange={this.handleSort}
              onClick={this.handleSort}
              options={sortOptions}
              selected={sortValue}/>
          <PrescriptionList
              items={this.props.prescriptions}
              // If we're sorting by facility, tell PrescriptionList to group 'em.
              grouped={sortValue === 'facilityName'}
              modalHandler={this.props.openRefillModal}/>
        </div>
      );
    }

    return (
      <div className="va-tab-content">
        <p className="rx-tab-explainer">Your active VA prescriptions.</p>
        {content}
      </div>
    );
  }
}

Active.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    prescriptions: state.prescriptions.items,
    sort: state.prescriptions.active.sort
  };
};

const mapDispatchToProps = {
  openRefillModal,
  loadPrescriptions,
  sortPrescriptions
};

export default connect(mapStateToProps, mapDispatchToProps)(Active);
