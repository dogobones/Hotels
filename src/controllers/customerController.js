const path = require('path');
const pool = require(path.join('..','db'));

const controller = {};

controller.list = (req, res) => {
  /*req.getConnection((err, conn) => {
    conn.query('SELECT * FROM customer', (err, customers) => {
     if (err) {
      res.json(err);
     }
     res.render('customers', {
        data: customers
     });
    });
  });*/
  res.render('home', {
     data: "Hello world!!!"
  });
};

controller.save = (req, res) => {
  const data = req.body;
  console.log(req.body)
  req.getConnection((err, connection) => {
    const query = connection.query('INSERT INTO customer set ?', data, (err, customer) => {
      console.log(customer)
      res.redirect('/');
    })
  })
};

controller.edit = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM customer WHERE id = ?", [id], (err, rows) => {
      res.render('customers_edit', {
        data: rows[0]
      })
    });
  });
};

controller.update = (req, res) => {
  const { id } = req.params;
  const newCustomer = req.body;
  req.getConnection((err, conn) => {

  conn.query('UPDATE customer set ? where id = ?', [newCustomer, id], (err, rows) => {
    res.redirect('/');
  });
  });
};

controller.delete = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, connection) => {
    connection.query('DELETE FROM customer WHERE id = ?', [id], (err, rows) => {
      res.redirect('/');
    });
  });
}
controller.getall = (req,res)=>{
  req.getConnection((err,connection) =>{
    connection.query('SELECT * FROM customer WHERE id=?', [id], (err,rows) =>{
      
    });
  });
}

/*router.get('/', (req, res) => {

    res.render('index');

});

router.get('/home', async (req, res) => {

    const rooms = await pool.query("SELECT * FROM rooms");

    res.json(rooms);

});

router.post('/room', async (req, res) => {

    //Set the host socket id in the table
    const settings = checkSettings(req.body);

    const values = [
        settings.roomName,
        settings.boardSize,
        settings.gameMode,
        settings.match,
        settings.timeMode,
        settings.timeDuration,
        settings.starter
    ];

    const { insertId } = await pool.query(
        "INSERT INTO rooms (roomName, boardSize, gameMode, match_, timeMode, timeDuration, starter) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?)", values
    );

    res.json(insertId);

});

router.get('/room/:roomId', async (req, res) => {

    const room = await pool.query("SELECT * FROM rooms WHERE id = ?", req.params.roomId);

    if(room[0] == null) {

        res.render('index');

    } else {

        res.render('room', room[0]);

    }

});*/

module.exports = controller;
