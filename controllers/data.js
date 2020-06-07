const express = require('express');
const router = express.Router();
const stringify = require('csv-stringify');
const posts = require('../posts.json');
const d3 = require("d3-time-format");

const convertJSON = (data) => {
  return (
    stringify(data, { 
      header: true,
      cast: {
        date: value => {
          // console.log(value);
            const formatTime = d3.timeFormat("%Y-%m-%d %H:%M")
            return formatTime(value);
        }
      }
    })
  )
}

const dbToFrontend = (req,res,db) => {
  // adding appropriate headers, so browsers can start downloading
  // file as soon as this request starts to get served
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  // db('sp500').where('id','<',10).then(data=>res.send(data));
  // db('sp500').where('id','<',10000).then(data => convertJSON(data).pipe(res));

const period = 'hour';

db('sp500')
  .select(db.raw(`date_trunc('${period}', datetime) datetime, \
    (array_agg(openprice ORDER BY datetime ASC))[1] o, \
    MAX(highprice) h, \
    MIN(lowprice) l, \
    (array_agg(closeprice ORDER BY datetime DESC))[1] c, \
    SUM(volume) volume, \
    COUNT(*) ticks`))
  .whereBetween('datetime', ['2000-11-08', '2000-12-08'])
  .groupBy(db.raw(`date_trunc('${period}', datetime)`))
  .orderBy('datetime')
  .limit(50)
  // .then(data=>console.log(data))
  // .then(data=>res.send(data));
  .then(data => convertJSON(data).pipe(res)
  );
}

module.exports = {
	handleData: dbToFrontend
};