var mysql = require('mysql');
var QueryBuilder = require("../SqlQueryBuilder/QueryBuilder");

class MySql extends QueryBuilder {

    constructor( connection,host,port,database,username,password ) {
        super();
        this.connection = connection;
        this.host       = host;
        this.port       = port;
        this.database   = database;
        this.username   = username;
        this.password   = password;
        this.handler    = null;
    }

    /*===========================================
      Build MySQL Connection
    ============================================*/
    init() {

        if(this.verify()) {

            this.handler = mysql.createConnection({
                host: this.host,
                port: this.port,
                user: this.username,
                password: this.password,
                database: this.database
            });

        } else {
            throw new Error(`MySQL Connection is not set to 'mysql'`);
        }
    }

    /*===========================================
        Verify Type Is MySQL
    ============================================*/
    verify() {
        return this.connection.toLowerCase() == 'mysql' ? true : false;
    }

    /*===========================================
        Allow Raw SQL And Args
    ============================================*/
    query( sql, args ) {

        if(this.handler == null) {
            this.init();
        }

        return new Promise( ( resolve, reject ) => {

            this.handler.query( sql, args, ( err, rows ) => {
                
                if ( err ) {
                    throw err;
                } else {
                    resolve( rows );
                }
            } );
        } );
        
    }
    close() {

        return new Promise( ( resolve, reject ) => {
            this.handler.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );

    }
}

module.exports = MySql;