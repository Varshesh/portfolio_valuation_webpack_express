import React, { Component } from 'react';
import DatePicker from "react-datepicker";

import Commom from '../../utils/common';
import Api from '../../utils/api';

import './style.scss';

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            transactionList: null,
            transactionListError: null,
        };

        this.portfolioNo = this.props.location.state ? this.props.location.state.portfolioNo : 0;
        this.totalValue = 0;
    }
    componentDidMount() {
        this.callApi(this.portfolioNo, this.state.selectedDate);
    }
    handleDateChange = (date) => {
        this.setState({ selectedDate: date });
        this.callApi(this.portfolioNo, date);
    }

    callApi = (portfolioNo, date) => {
        Api.getTransactionsByPortfolio(this.portfolioNo, date).then(res => {
            if (res.status === 200) {
                // console.log(res.data);
                this.totalValue = res.data.totalValue;
                this.setState({ transactionList: res.data.transactionList });
            }
        }).catch(err => this.setState({ portfoliosListError: 'Error fetching data.' }));
    }

    render() {
        const transactionDetailRow = (obj, index) => {
            return (
                <div className={"row " + (obj.bsType === 'Sell' ? 'sell-row' : '')} key={index}>
                    <div className="col-4">{obj.bsType}</div>
                    <div className="col-2">{Commom.formatDate(obj.bsDate)}</div>
                    <div className="col-2">{obj.shares}</div>
                    <div className="col-2">{obj.bsPrice}</div>
                    <div className="col-2">{obj.bsAmount}</div>
                </div>
            )
        };
        const transactionRow = (obj, index) => {
            return (
                <React.Fragment key={index}>
                    <div className="row list-row collapsed" data-toggle="collapse" data-target={".security_" + index} aria-expanded="false" >
                        <div className="col-4"><i className="fa fa-angle-up" aria-hidden="true"></i>{obj.name}</div>
                        <div className="col-2">{Commom.formatDate(obj.date)}</div>
                        <div className="col-2">{obj.shares}</div>
                        <div className="col-2">{obj.price}</div>
                        <div className="col-2">{obj.amount}</div>
                    </div>
                    <div className={"collapse list-row-details security_" + index}>
                        {obj.data.map(transactionDetailRow)}
                    </div>
                </React.Fragment >
            )
        };
        return (
            <div className="transactions-container" >

                <div className="clearfix">
                    <h5 className="fl">Transactions of Portfolio {this.portfolioNo}</h5>

                    <div className="date-container fr">
                        <span className="select-date">Portfolio Value by Date: </span>
                        <DatePicker
                            selected={this.state.selectedDate}
                            onChange={this.handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            maxDate={new Date()}
                        />
                    </div>
                </div>


                <div className="container-fluid" id="transactions-list">
                    <div className="row list-header">
                        <div className="col-4">Name</div>
                        <div className="col-2">Date</div>
                        <div className="col-2">Shares</div>
                        <div className="col-2">Price</div>
                        <div className="col-2">Amount</div>
                    </div>

                    {this.state.transactionList && this.state.transactionList.map(transactionRow)}
                    <div className="row total-port-value-container">
                        <div className="col-10">Total Portfolio Value</div>
                        <div className="col-2">{this.totalValue}</div>
                    </div>
                </div>

            </div >
        );
    }
}

export default Transactions;