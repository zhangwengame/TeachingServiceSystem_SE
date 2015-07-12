
/*

  Usage:

    1. copy this file to 'settings.js'
    2. modify db.connect to your mongodb url
      1. e.g. mongodb://[username[:passwd]@]ipaddress[:port][/dbname]
*/

module.exports = {
  db : {
    // modify the line below
	connect : 'mongodb://127.0.0.1:27017/test'
	//connect : 'mongodb://tssapp:tssapp@10.214.128.197:27123/tss'
  }
}

