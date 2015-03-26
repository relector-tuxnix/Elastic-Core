
# Elastic-Core
A simple website core using in total.js and elastic-search. This just a base website consisting of shared components that can be used to build bigger and better websites!

## Requirements

 <ul>
   <li><a target="_new" href="https://nodejs.org/">Node.js</a></li>
   <li><a target="_new" href="https://www.npmjs.com/">NPM.js</a></li>
   <li><a target="_new" href="https://www.elastic.co/downloads/elasticsearch">Elastic Search</a></li>
   <li><a target="_new" href="https://www.totaljs.com">Total.js</a></li>
   <li><a target="_new" href="https://www.npmjs.com/package/bcrypt-nodejs">ElasticSearch.js</a></li>
   <li><a target="_new" href="http://handlebarsjs.com/">Handlebars.js</a></li>
 </ul>

## Linux Installation

  $> git clone https://github.com/neonnds/Elastic-Core.git
  
  $> cd ./Elastic-Core
  
  $> wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-1.5.0.tar.gz
  
  $> tar -zxf elasticsearch-1.5.0.tar.gz
    
  $> rm elasticsearch-1.5.0.tar.gz
  
  $> cd sites/elastic-core/
  
  $> npm install total.js --save
  
  $> npm install elasticsearch --save
  
  $> npm install bcrypt-nodejs --save
  
  $> npm install handlebars --save
  
  
## Getting Started

  * Enter the Elastic-Core project

  $> cd ./Elastic-Core

  * Start Elastic Search
  
  $> ./elasticsearch-1.5.0/bin/elasticsearch

  * Start Elastic-Core
  
  $> ./run elastic-core
