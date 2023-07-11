const config = {

    user: 'Dino2023',
    password: '2023Dino',
    server: 'ASTRDINO',
    database: 'trainDB',
    options:{
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        multipleStatements:true,
        instancename: 'MSSQLSERVER'
    },
    port: 1433



}

module.exports = config