var elasticsearch = require('elasticsearch');

// Connect the client to two nodes, requests will be
// load-balanced between them using round-robin
var client = elasticsearch.Client({
	hosts: ['localhost:9200']
});

exports.client = client;

client.indices.create({

	index: 'users',

	body : {
		"mappings" : {
			"user" : {
				_id : {
					"path" : "id",
					"store" : "true",
					"index": "analyzed"
				},
				"properties" : {
					"id" : {"type" : "string", "index" : "analyzed", "null_value" : "na"},
					"password" : {"type" : "string", "null_value" : "na"},
					"created" : {"type" : "date", "index" : "analyzed", "null_value" : "na"}
				}
			}
		}
	}

}, function(err, result) {});

