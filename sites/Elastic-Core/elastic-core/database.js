/*
 * Couchbase Setup:
 * 
 *	$> ln -s /usr/bin/python2.7 /usr/bin/python
 *	$> cd /opt/couchbase
 *	$> ./bin/install/reloc.sh `pwd`
 *	$> ulimit -Hn #Needs to be greater than 4096
 *	$> sudo vim /etc/security/limits.conf #Domain is a user or group
 *		<domain>              soft    nofile                 163840
 *		<domain>              hard    nofile                 163840 
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

$.couchbase = couchbase;
$.cluster = new $.couchbase.Cluster('couchbase://127.0.0.1/');
$.bucket = $.cluster.openBucket('core');
$.query = $.couchbase.N1qlQuery;
