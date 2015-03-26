
# Elastic-Core
A simple website core using in total.js and elastic-search. This just a base website consisting of shared components that can be used to build bigger and better websites!

## Requirements

* [Node.js](https://nodejs.org/)
* [NPM.js](https://www.npmjs.com/)
* [Elastic Search](https://www.elastic.co/downloads/elasticsearch)
* [Total.js](https://www.totaljs.com)
* [ElasticSearch.js](https://www.npmjs.com/package/bcrypt-nodejs)
* [Handlebars.js](http://handlebarsjs.com/)

## Linux Installation
  
**$>** git clone https://github.com/neonnds/Elastic-Core.git

**$>** cd ./Elastic-Core

**$>** wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-1.5.0.tar.gz

**$>** tar -zxf elasticsearch-1.5.0.tar.gz
 
**$>** rm elasticsearch-1.5.0.tar.gz

**$>** cd sites/elastic-core/

**$>** npm install total.js --save

**$>** npm install elasticsearch --save

**$>** npm install bcrypt-nodejs --save

**$>** npm install handlebars --save
  
  
## Getting Started

Enter the Elastic-Core project

    $> cd ./Elastic-Core

Start Elastic Search

    $> ./elasticsearch-1.5.0/bin/elasticsearch

Start Elastic-Core

    $> ./run elastic-core
