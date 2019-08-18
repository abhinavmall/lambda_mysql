const mysql = require('mysql');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

const con = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT,
    database : process.env.RDS_DATABASE
});

exports.handler = async (event, context, callback) => {
    console.log("querying start")

    //context.callbackWaitsForEmptyEventLoop = false;
    const max_query = "SELECT\n" +
        "       *\n" +
        "FROM person\n" +
        "ORDER BY value DESC\n" +
        "LIMIT 1";

    const result = await new Promise( (resolve, reject) => {
        con.query(max_query, function (err, result) {
            if (err) {
                console.log(err);
                reject(null, "No data present");
            } else {
                console.log("success in querying database");
                console.log(result);
                resolve(result)
            }
        });
    });

    if (!result) {
        var response = {
            message : 'No data found'
        }
        callback(null, JSON.stringify(response))
    }
    else {
        var response = {
            name: result[0].name,
            value: result[0].value
        }
        callback(null, JSON.stringify(response))
    }
    console.log("end querying")
};