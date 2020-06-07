const express = require('express');
const router = express.Router();
// package use to transform json to csv string
const stringify = require('csv-stringify');
const posts = require('../posts.json');

const d3 = require("d3-time-format");

const convertJSON = (req,res,db) => {
  // adding appropriate headers, so browsers can start downloading
  // file as soon as this request starts to get served
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  // db('sp500').where('id','<',10).then(data=>res.send(data));
  db('sp500').where('id','<',10000).then(data =>
  	stringify(data, { 
  		header: true,
  		cast: {
    		date: function(value) {
    			// console.log(value);
      			// return value.toISOString();
      			// return value.toDateString();
      			// const formatTime = d3.timeFormat("%d/%m/%Y %H:%M")
      			const formatTime = d3.timeFormat("%Y-%m-%d")
      			return formatTime(value);

		    }
		}
  	}).pipe(res));
  
  // stringify returns a readable stream, that can be directly piped
  // to a writeable stream which is "res" (the response object from express.js)
  // since res is an abstraction over node http's response object which supports "streams"
  // stringify(posts, { header: true }).pipe(res);
}

module.exports = {
	handleData: convertJSON
};