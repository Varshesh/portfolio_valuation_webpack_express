const express = require('express');
const fs = require('fs');
const uniqBy = require('lodash/uniqBy');
const find = require('lodash/find');
const filter = require('lodash/filter');
const sumBy = require('lodash/sumBy');

// Erxpress router to route api's
const router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// For testing api [Dummy - DELETE]
router.get('/testapicall', (req, res) => {
    res.send({ test: 'Hello From Express' });
});

router.post('/getPortfolios', (req, res) => {
    fs.readFile('data/portfolios.json', (err, data) => {
        if (err) throw err;
        let portfoliosJData = JSON.parse(data).Portfolios;
        //console.log(portfoliosJData.length, portfoliosJData);

        var portfoliosList = [];
        var portObj = null;

        for (var i = 0; i < portfoliosJData.length; i++) {
            portObj = portfoliosJData[i];
            var numberOfHoldings = uniqBy(portObj.Transactions, function (e) {
                return e.SecurityId;
            }).length;
            var lastModifiedDate = new Date(Math.max.apply(null, portObj.Transactions.map(e => {
                return new Date(e.Date);
            })));
            portfoliosList.push({
                id: portObj._Id,
                name: portObj.Name,
                numberOfHoldings,
                lastModifiedDate: formatDate(lastModifiedDate)
            });
        }
        res.send({ portfoliosList });
    });

});

router.post('/getTransactionsByPortfolio', (req, res) => {
    fs.readFile('data/portfolios.json', (err, data) => {
        if (err) throw err;
        let portfoliosJData = JSON.parse(data).Portfolios;
        var portfolioObject = find(portfoliosJData, { '_Id': req.body.portfolioId });
        console.log(portfoliosJData);
        var portfolioDateObject = filter(portfolioObject.Transactions, function (o) {
            return formatDate(new Date(o.Date)) <= formatDate(new Date(req.body.date));
        });
        console.log(portfolioDateObject);
        fs.readFile('data/securities.json', (err, data) => {
            if (err) throw err;
            let transactionsJData = JSON.parse(data).Securities;
            let transactionList = [];
            for (let i = 0; i < portfolioDateObject.length; i++) {
                // console.log(find(secHist, { '_Id': portfolioDateObject[i].SecurityId }));                
                let secHist = find(transactionsJData, { '_Id': portfolioDateObject[i].SecurityId });

                let hdVal = find(secHist.HistoryDetail, { 'EndDate': formatDate(new Date(portfolioDateObject[i].Date)) });
                //console.log(hdVal, formatDate(new Date(portfolioDateObject[i].Date)));
                if (!hdVal) {
                    let dateHistory = filter(secHist.HistoryDetail, function (o) {
                        return new Date(o.EndDate) < new Date(portfolioDateObject[i].Date);
                    });

                    hdVal = find(secHist.HistoryDetail, { 'EndDate': formatDate(new Date(dateHistory[dateHistory.length - 1].EndDate)) });
                }
                if (hdVal) {
                    let shares = toFixed(+portfolioDateObject[i].Amount / +hdVal.Value, 2);

                    let hdValCurrent = find(secHist.HistoryDetail, { 'EndDate': formatDate(new Date(req.body.date)) });
                    if (!hdValCurrent) {
                        hdValCurrent = secHist.HistoryDetail[secHist.HistoryDetail.length - 1];
                    }

                    var refTL = find(transactionList, { name: secHist.name });
                    if (refTL) {
                        refTL.date = formatDate(new Date(req.body.date));
                        if (portfolioDateObject[i].Type === 'Buy') {
                            refTL.shares = toFixed(refTL.shares + shares, 2);
                            refTL.amount = toFixed(refTL.amount + toFixed(shares * +hdValCurrent.Value, 2), 2);
                        } else {
                            refTL.shares = toFixed(refTL.shares - shares, 2);
                            refTL.amount = toFixed(refTL.amount - toFixed(shares * +hdValCurrent.Value, 2), 2);
                        }
                        //refTL.price = toFixed(+hdValCurrent.Value, 2);
                        refTL.data.push({
                            shares,
                            bsType: portfolioDateObject[i].Type,
                            bsDate: formatDate(new Date(portfolioDateObject[i].Date)),
                            bsPrice: toFixed(+hdVal.Value, 2),
                            bsAmount: toFixed(+portfolioDateObject[i].Amount)
                        });
                    } else {
                        let securityObj = {
                            name: secHist.name,
                            date: formatDate(new Date(req.body.date)),
                            shares,
                            price: toFixed(+hdValCurrent.Value, 2),
                            amount: toFixed(shares * +hdValCurrent.Value, 2),
                            data: [{
                                shares,
                                bsType: portfolioDateObject[i].Type,
                                bsDate: formatDate(new Date(portfolioDateObject[i].Date)),
                                bsPrice: toFixed(+hdVal.Value, 2),
                                bsAmount: toFixed(+portfolioDateObject[i].Amount)
                            }]
                        }
                        transactionList.push(securityObj);
                    }

                } else {
                    transactionList.push({ error: "No data found for: " + secHist.name });
                }

            }
            let totalValue = sumBy(transactionList, function (d) {
                console.log(d.amount)
                return +d.amount;
            });

            res.send({ transactionList, totalValue: toFixed(totalValue, 2) });
            // res.send({ transactionList });
        });

    });


});

function toFixed(num, fixed) {
    return parseFloat(num.toFixed(fixed));
}
function formatDate(date) {
    return date.getFullYear() +
        '-' +
        ((date.getMonth() + 1).toString().length < 2 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) +
        '-' +
        date.getDate();
}

module.exports = router;