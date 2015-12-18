
# Elastic-Core
A simple website core using in total.js and elastic-search. This just a base website consisting of shared components that can be used to build bigger and better websites!


## Requirements

* [Node.js](https://nodejs.org/)
* [NPM.js](https://www.npmjs.com/)
* [Elastic Search](https://www.elastic.co/downloads/elasticsearch)
* [Total.js](https://www.totaljs.com)
* [ElasticSearch.js](https://www.npmjs.com/package/bcrypt-nodejs)
* [BCrypt-NodeJS](https://www.npmjs.com/package/bcrypt-nodejs)
* [Handlebars.js](http://handlebarsjs.com/)
* [Handlebars-form-helpers](https://github.com/badsyntax/handlebars-form-helpers)

## Linux Installation

Get the Elastic-Core project

    $> git clone https://github.com/neonnds/Elastic-Core.git

Enter the Elastic-Core project

    $> cd ./Elastic-Core

Get ElasticSearch from the offical site

    $> wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-2.1.0.tar.gz

Extract ElasticSearch

    $> tar -zxf elasticsearch-2.1.0.tar.gz

Enter the Elastic-Core nodejs project

    $> cd sites/Elastic-Core/

Install the following node modules

    $> npm install total.js --save

    $> npm install elasticsearch --save

    $> npm install bcrypt-nodejs --save

    $> npm install handlebars --save
    
    $> npm install handlebars-form-helpers --save
 
Enter the Elastic-Core project

    $> cd ./Elastic-Core

Start Elastic Search

    $> ./elasticsearch-2.1.0/bin/elasticsearch

Start Elastic-Core

    $> ./run Elastic-Core
