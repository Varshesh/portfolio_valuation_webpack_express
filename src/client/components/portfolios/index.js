import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import _ from 'lodash';
import Commom from '../../utils/common';
import Api from '../../utils/api';

import './style.scss';

class Portfolios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portfoliosList: '',
            portfoliosListError: null,
        };
        this.orgPortfoliosList = null;
    }

    componentDidMount() {
        Api.getPortfolios().then(res => {
            if (res.status === 200) {
                // console.log(res);
                this.orgPortfoliosList = res.data.portfoliosList;
                this.setState({ portfoliosList: this.orgPortfoliosList });
            }
        }).catch(err => this.setState({ portfoliosListError: 'Error fetching data.' }));
    }

    handleOnSearchChange = (e) => {
        var portfoliosList = _.filter(this.orgPortfoliosList, (itm) => {
            return itm.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1;
        });
        if (e.target.value.trim().length === 0) {
            portfoliosList = this.orgPortfoliosList;
        }
        this.setState({ portfoliosList });
    }
    onPortfolioRowClick = (e, obj) => {
        this.props.history.push({ pathname: '/transactions', state: { portfolioNo: obj.id } });
    }
    render() {
        const portfolioRow = (obj, index) => {
            return (<tr key={index} onClick={e => this.onPortfolioRowClick(e, obj)}>
                <td>{obj.name}</td>
                <td>{obj.numberOfHoldings}</td>
                <td>{Commom.formatDate(obj.lastModifiedDate)}</td>
            </tr>);
        }
        return (
            <div className="portfolios-container">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search" onChange={this.handleOnSearchChange} />
                    <div className="input-group-btn">
                        <button className="btn btn-default" type="submit">
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                <div>
                    <table id="portfolios-list" className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: '60%' }}>Name</th>
                                <th>Number Of Holdings(Securities)</th>
                                <th>Last Modified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.portfoliosList ? this.state.portfoliosList.map(portfolioRow) :
                                <tr><td colSpan="3">No Records found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default withRouter(Portfolios);