module.exports = async function(app) {
    const db = await require('../db/db').connection;
    
    app.get('/api/insertBoard', async function(req, res){
        db.getConnection(async (err,connection) => {
            const query = util.promisify(connection.query).bind(connection);
            const sql = `
                INSERT INTO board
                (title)
                VALUES ('hi')
            `
            await query(sql);
            connection.release();
            res.json({r:true});
        }); 
    });

};

