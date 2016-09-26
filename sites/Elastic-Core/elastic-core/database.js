/*
 * Couchbase Setup:
 * 
 *	$> ln -s /usr/bin/python2.7 /usr/bin/python
 *	$> cd /opt/couchbase
 *	$> ./bin/install/reloc.sh `pwd`
 *	$> ./bin/couchbase-server -- -noinput -detached 
 *	$> ./bin/couchbase-server -k
 *	$> sudo ./bin/cbbackup http://127.0.0.1:8091 backups/backup-X
 *	$> ./bin/cbq
 *	$>	CREATE PRIMARY INDEX `coreIndex` ON `core` USING GSI;
 *	$>	CREATE INDEX `coreKeyIndex` ON `core`(`_key`) USING GSI;
 *	$>	CREATE INDEX `coreTypeIndex` ON `core`(`_type`) USING GSI;
 *
 */

var couchbase = require('couchbase')

var $ = module.exports;

$.cluster = new couchbase.Cluster('couchbase://127.0.0.1/');
$.bucket = $.cluster.openBucket('core');
$.query = couchbase.N1qlQuery;
