var elasticsearch = require('elasticsearch');

/* Connect the client to two nodes, requests will be load-balanced between them using round-robin */
var client = elasticsearch.Client({
	hosts: ['localhost:9200']
});

exports.client = client;

client.indices.create({

	index: 'users',

	body : {
		"mappings" : {
			"user" : {
				"properties" : {
					"id" : {"type" : "string", "index" : "analyzed", "null_value" : "na"},
					"password" : {"type" : "string", "null_value" : "na"},
					"updated" : {"type" : "date", "format" : "yyyy/MM/dd", "index" : "analyzed", "null_value" : "now"},
					"created" : {"type" : "date", "format" : "yyyy/MM/dd", "index" : "analyzed", "null_value" : "now"}
				}
			}
		}
	}

}, function(err, result) {});

