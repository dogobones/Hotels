const path = require('path');
const pool = require(path.join(__dirname,'.','db'));

module.exports = io => {

    io.on('connection', (socket) => {

        console.log('User up: ', socket.id);

        socket.on('init', async (data) => {

          const hotel = await pool.query("SELECT * FROM Hoteles WHERE id = ?", data.hotel_id);
          const areas = await pool.query("SELECT * FROM Areas WHERE hotel_id = ?", data.hotel_id);

          socket.join(socket.id);
          socket.join(data.hotel_id);

          io.in(socket.id).emit('actualizarMapa', hotel);
          io.in(socket.id).emit('actualizarAreas', areas);

        });

        socket.on('descartar', async (data) => {

          const hotel = await pool.query("SELECT * FROM Hoteles WHERE id = ?", data.hotel_id);
          const areas = await pool.query("SELECT * FROM Areas WHERE hotel_id = ?", data.hotel_id);

          io.in(socket.id).emit('actualizarMapa', hotel);
          io.in(socket.id).emit('actualizarAreas', areas);

        });

        socket.on('nuevaArea', async (data) => {

          await pool.query("INSERT INTO Areas (nombre, estado, hotel_id, color, border, piso) VALUES (?, ?, ?, ?, ?, ?)", [
            data.nombre, data.estado, data.hotel_id, colores(data.estado)[0], colores(data.estado)[1], data.piso
          ]);

          const areas = await pool.query("SELECT * FROM Areas WHERE hotel_id = ?", data.hotel_id);

          io.in(data.hotel_id).emit('actualizarAreas', areas);
          socket.broadcast.to(data.hotel_id).emit('cambiosExternos');

        });

        socket.on('nuevoNombre', async (data) => {

          await pool.query("UPDATE Areas SET nombre = ? WHERE id = ?", [
            data.nombre, data.area
          ]);

          const areas = await pool.query("SELECT * FROM Areas WHERE hotel_id = ?", data.hotel_id);

          io.in(data.hotel_id).emit('actualizarAreas', areas);

        });

        socket.on('nuevoEstado', async (data) => {

          await pool.query("UPDATE Areas SET estado = ?, color = ?, border = ? WHERE id = ?", [
            data.estado, colores(data.estado)[0], colores(data.estado)[1], data.area
          ]);

          const areas = await pool.query("SELECT * FROM Areas WHERE hotel_id = ?", data.hotel_id);

          io.in(data.hotel_id).emit('actualizarAreas', areas);

        });

        socket.on('eliminarArea', async (data) => {

          await pool.query("DELETE FROM Areas WHERE id = ?", data.area);

          const areas = await pool.query("SELECT * FROM Areas WHERE hotel_id = ?", data.hotel_id);

          io.in(data.hotel_id).emit('actualizarAreas', areas);
          socket.broadcast.to(data.hotel_id).emit('cambiosExternos');

        });

        socket.on('sincronizacion', async (data) => {

          await pool.query("UPDATE Hoteles SET `left` = ?, top = ?, width = ?, height = ? WHERE id = ?", [
            data.left, data._top, data.width, data.height, data.sitio
          ]);

          for(var i = 0; i < data.allAreas.length ; i++) {

            await pool.query("UPDATE Areas SET `left` = ?, top = ?, width = ?, height = ? WHERE id = ?", [
              data.allAreas[i].left, data.allAreas[i].top, data.allAreas[i].width, data.allAreas[i].height, data.allAreas[i].id
            ]);

          }

          const hotel = await pool.query("SELECT * FROM Hoteles WHERE id = ?", data.sitio);
          const areas = await pool.query("SELECT * FROM Areas WHERE hotel_id = ?", data.sitio);

          socket.broadcast.to(data.sitio).emit('actualizarMapa', hotel);
          socket.broadcast.to(data.sitio).emit('actualizarAreas', areas);
          socket.broadcast.to(data.sitio).emit('cambiosExternos');

        });

        socket.on('actualizarPisos', async (data) => {

          const pisos = await pool.query("SELECT DISTINCT piso FROM Areas WHERE hotel_id = ? ORDER BY `piso` ASC", data.hotel_id);

          io.in(data.hotel_id).emit('actualizarPisos', pisos);

        });

        socket.on('disconnect', async () => {

            console.log('User down: ', socket.id);

        });

        function colores(estado) {

          var color, border;

          switch(estado) {
            case "0":
              color = "#f9152f";
              border = "darkred";
              break;
            case "1":
              color = "#4dfd60";
              border = "green";
              break;
            case "2":
              color = "#fcf73b";
              border = "orange";
          }

          return [color, border];

        }

        /*socket.on('turnReady', async (action) => {

            var room = await pool.query("SELECT * FROM rooms WHERE userA = ? OR userB = ?", [socket.id, socket.id]);

            if(room[0] != null) {

                //console.log(action);

                var field = "", pos, letter, points;

                var time = getTime(room, "00000000");

                var next = true;

                if(action.action != "starting") {

                    if(action.action == "nextGame") {

                        var winsA = 0, winsB = 0;

                        if(room[0].pointsA > room[0].pointsB) {

                            winsA = parseInt(room[0].wins.charAt(0)) + 1;
                            winsB = parseInt(room[0].wins.charAt(1));

                        } else if(room[0].pointsA < room[0].pointsB) {

                            winsA = parseInt(room[0].wins.charAt(0));
                            winsB = parseInt(room[0].wins.charAt(1)) + 1;

                        } else {

                            winsA = parseInt(room[0].wins.charAt(0));
                            winsB = parseInt(room[0].wins.charAt(1));

                        }

                        for(var i = 0; i < room[0].board.length ;i++) {

                            field += "0";

                        }

                        var onTurn = 0;

                        if((room[0].pointsA + room[0].pointsB) % 2 != 0) {

                            if(room[0].onTurn == 0) onTurn = 1;
                            else onTurn = 0;

                        } else {

                            onTurn = room[0].onTurn;

                        }

                        await pool.query("UPDATE rooms SET pointsA = 0, pointsB = 0, onTurn = ?, board = ?, wins = ? WHERE id = ?", [onTurn, field, winsA+""+winsB, room[0].id]);

                        room = await pool.query("SELECT * FROM rooms WHERE id = ?", [room[0].id]);

                    } else if(action.action == "gameOver") {

                        var winsA = 0, winsB = 0;

                        if(room[0].pointsA > room[0].pointsB) {

                            winsA = parseInt(room[0].wins.charAt(0)) + 1;
                            winsB = parseInt(room[0].wins.charAt(1));

                        } else {

                            winsA = parseInt(room[0].wins.charAt(0));
                            winsB = parseInt(room[0].wins.charAt(1)) + 1;

                        }

                        await pool.query("UPDATE rooms SET wins = ? WHERE id = ?", [winsA+""+winsB, room[0].id]);

                        room = await pool.query("SELECT * FROM rooms WHERE id = ?", [room[0].id]);

                        if(winsA > winsB) {

                            if(socket.id == room[0].userA) {

                                io.in(socket.id).emit('gameEnded', { result: "<p style='color: blue;'>!You win the match "+ winsA +" to "+ winsB +"!</p>", room: room[0] });
                                io.in(room[0].userB).emit('gameEnded', { result: "<p style='color: red;'>!You lose the match "+ winsA +" to "+ winsB +"!</p>", room: room[0] });

                            } else {

                                io.in(socket.id).emit('gameEnded', { result: "<p style='color: red;'>!You lose the match "+ winsA +" to "+ winsB +"!</p>", room: room[0] });
                                io.in(room[0].userA).emit('gameEnded', { result: "<p style='color: blue;'>!You win the match "+ winsA +" to "+ winsB +"!</p>", room: room[0] });

                            }

                        } else if(winsA < winsB) {

                            if(socket.id == room[0].userA) {

                                io.in(socket.id).emit('gameEnded', { result: "<p style='color: red;'>!You lose the match "+ winsA +" to "+ winsB +"!</p>", room: room[0] });
                                io.in(room[0].userB).emit('gameEnded', { result: "<p style='color: blue;'>!You win the match "+ winsA +" to "+ winsB +"!</p>", room: room[0] });

                            } else {

                                io.in(socket.id).emit('gameEnded', { result: "<p style='color: blue;'>!You win the match "+ winsA +" to "+ winsB +"!</p>", room: room[0] });
                                io.in(room[0].userA).emit('gameEnded', { result: "<p style='color: red;'>!You lose the match "+ winsA +" to "+ winsB +"!</p>", room: room[0] });

                            }

                        } else {

                            io.in(room[0].userA).emit('gameEnded', { result: "<p style='color: orange;'>!Match finished with a draw "+ winsA +" to "+ winsB +"!</p>", room: room[0] });
                            io.in(room[0].userB).emit('gameEnded', { result: "<p style='color: orange;'>!Match finished with a draw "+ winsA +" to "+ winsB +"!</p>", room: room[0] });

                        }

                        io.in(room[0].id).emit('spectator', { action: "normal", time: time, room: room[0] });

                        next = false;

                    } else if(action.action == "timeOver") {

                        if(room[0].onTurn == 0) {

                            io.in(room[0].userA).emit('timeOver', { message: "<p style='color: red;'>Time over, !You lose the match!</p>" });
                            io.in(room[0].userB).emit('timeOver', { message: "<p style='color: blue;'>Time over, !You win the match!</p>"});
                            io.in(room[0].id).emit('spectator', { action: "desconection", message: "<p style='color: red;'>Time over, !The red player wins!</p>" });

                        } else {

                            io.in(room[0].userA).emit('timeOver', { message: "<p style='color: blue;'>Time over, !You win the match!</p>" });
                            io.in(room[0].userB).emit('timeOver', { message: "<p style='color: red;'>Time over, !You lose the match!</p>" });
                            io.in(room[0].id).emit('spectator', { action: "desconection", message: "<p style='color: blue;'>Time over, !The blue player wins!</p>" });

                        }

                        next = false;

                    } else {

                        try {

                            pos = parseInt(action.cell);

                        } catch(error) {

                            pos = 0;

                        }

                        letter = 0;

                        if(action.letter == "O") letter = 1;
                        else letter = 2;

                        if(room[0].board.charAt(pos) == "0") {

                            if(pos == 0) {

                                field = letter + room[0].board.slice(1, room[0].board.length);

                            } else if(pos == (room[0].board.length - 1)) {

                                field = room[0].board.slice(0, room[0].board.length - 1) + letter;

                            } else {

                                field = room[0].board.slice(0, pos) + letter + room[0].board.slice(pos + 1, room[0].board.length);

                            }

                            points = checkOsos(field, letter, pos);

                            if(points > 0) {

                                //console.log("No pasar turno...");

                                var pointsColumn = "";

                                if(room[0].onTurn == 0) {

                                    pointsColumn = "pointsA";
                                    points += room[0].pointsA;

                                } else {

                                    pointsColumn = "pointsB";
                                    points += room[0].pointsB;

                                }

                                await pool.query("UPDATE rooms SET " + pointsColumn + " = ?, board = ? WHERE id = ?", [points, field, room[0].id]);

                            } else {

                                //console.log("Pasar turno...");

                                if(room[0].onTurn == 0) {

                                    await pool.query("UPDATE rooms SET onTurn = 1, board = ? WHERE id = ?", [field, room[0].id]);

                                } else {

                                    await pool.query("UPDATE rooms SET onTurn = 0, board = ? WHERE id = ?", [field, room[0].id]);

                                }

                            }

                            room = await pool.query("SELECT * FROM rooms WHERE id = ?", [room[0].id]);


                        } else {

                            //Error

                        }

                    }

                }

                if(next) {

                    if(room[0].userA == socket.id) {

                        if(room[0].onTurn == 0) {

                            io.in(socket.id).emit('newTurn', { time: time, turn: "You", room: room[0] });
                            io.in(room[0].userB).emit('newTurn', { time: time, turn: "Oponent", room: room[0] });

                        } else {

                            io.in(socket.id).emit('newTurn', { time: time, turn: "Oponent", room: room[0] });
                            io.in(room[0].userB).emit('newTurn', { time: time, turn: "You", room: room[0] });

                        }

                    } else {

                        if(room[0].onTurn == 0) {

                            io.in(socket.id).emit('newTurn', { time: time, turn: "Oponent", room: room[0] });
                            io.in(room[0].userA).emit('newTurn', { time: time, turn: "You", room: room[0] });

                        } else {

                            io.in(socket.id).emit('newTurn', { time: time, turn: "You", room: room[0] });
                            io.in(room[0].userA).emit('newTurn', { time: time, turn: "Oponent", room: room[0] });

                        }

                    }

                    io.in(room[0].id).emit('spectator', { action: "normal", time: time, room: room[0] });

                } else {

                    await pool.query("DELETE FROM rooms WHERE id = ?", room[0].id);

                }

            } else {

                //console.log("Spectating...");

            }

        });

        socket.on('message', async (data) => {

            const room = await pool.query("SELECT userA, userB FROM rooms WHERE id = ?", [data.id]);

            if(room[0] != null) {

                var message = data.message;

                if(message.length > 128) message = "...";

                if(socket.id == room[0].userA || socket.id == room[0].userB) {

                    socket.broadcast.to(data.id).emit('message', { sender: "<span style='color: red'>&nbsp;Oponent: </span>", message: message } );

                } else {

                    socket.broadcast.to(data.id).emit('message', { sender: "<span style='color: green'>&nbsp;Spectator: </span>", message: message } );

                }

            }

        });

        socket.on('newUser', async (data) => {

            const room = await pool.query("SELECT * FROM rooms WHERE id = ?", [data.id]);

            if(room[0] != null) {

                if(room[0].userA == null) {

                    var size = "0000000000000000000000000000000000000000000000000";

                    if(room[0].boardSize == "Random") {

                        const r = Math.random();

                        if(r < 0.25) size = "0000000000000000000000000";
                        else if(r < 0.5) size = "0000000000000000000000000000000000000000000000000";
                        else if(r < 0.75) size = "000000000000000000000000000000000000000000000000000000000000000000000000000000000";
                        else size = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

                    } else if(room[0].boardSize == "5x5") {

                        size = "0000000000000000000000000";

                    } else if(room[0].boardSize == "7x7") {

                        size = "0000000000000000000000000000000000000000000000000";

                    } else if(room[0].boardSize == "9x9") {

                        size = "000000000000000000000000000000000000000000000000000000000000000000000000000000000";

                    } else if(room[0].boardSize == "11x11") {

                        size = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

                    }

                    await pool.query("UPDATE rooms SET userA = ?, board = ? WHERE id = ?", [socket.id, size, room[0].id]);

                    socket.join(socket.id);
                    socket.join(room[0].id);

                    var time = getTime(room, "00000000");

                    //console.log("Waiting for an oponent");

                    io.in(socket.id).emit('waiting', { time: time, size: size.length, message: "Waiting for an oponent" } );

                } else if(room[0].userB == null) {

                    var r = Math.random();
                    var random = false;

                    if(room[0].starter == "Random") {

                        random = true;

                        if(r < 0.5) r = 0;
                        else r = 1;

                    } else if(room[0].starter == "You") {

                        r = 0;

                    } else {

                        r = 1;

                    }

                    var time = getTime(room, "00000000");

                    await pool.query("UPDATE rooms SET userB = ?, pointsA = 0, pointsB = 0, onTurn = ?, wins = '00' WHERE id = ?", [socket.id, r, room[0].id]);

                    socket.join(socket.id);
                    socket.join(room[0].id);

                    //console.log("Setting the starter of the match");

                    switch(r) {

                        case 0:

                            io.in(room[0].userA).emit('starting', { time: time, size: room[0].board.length, random: random, turn: "You", message: "Setting the starter of the match..." } );
                            io.in(socket.id).emit('starting', { time: time, size: room[0].board.length, random: random, turn: "Oponent", message: "Setting the starter of the match..." } );

                            break;

                        case 1:

                            io.in(room[0].userA).emit('starting', { time: time, size: room[0].board.length, random: random, turn: "Oponent", message: "Setting the starter of the match..." } );
                            io.in(socket.id).emit('starting', { time: time, size: room[0].board.length, random: random, turn: "You", message: "Setting the starter of the match..." } );

                    }

                } else if(room[0].userA == socket.id || room[0].userB == socket.id) {

                    io.in(socket.id).emit('desconection', { message: "<p style='color: orange;'>This game was closed</p>" } );
                    socket.broadcast.to([room[0].id]).emit('desconection', { message: "<p style='color: orange;'>The oponent has left the game</p>" } );

                } else {

                    socket.join(room[0].id);

                    var time = getTime(room, "00000000");

                    io.in(room[0].id).emit('spectator', { action: "normal", time: time, room: room[0] });

                }

            } else {

                io.in(socket.id).emit('desconection', { message: "<p style='color: orange;'>This game was closed</p>" } );
                socket.broadcast.to([room[0].id]).emit('desconection', { message: "<p style='color: orange;'>The oponent has left the game</p>" } );

            }

        });

        socket.on('disconnect', async () => {

            console.log('User down: ', socket.id);

            const room = await pool.query("SELECT id, userA, userB FROM rooms WHERE userA = ? OR userB = ?", [socket.id, socket.id]);

            if(room[0] != null) {

                socket.broadcast.to([room[0].id]).emit('desconection', { message: "<p style='color: orange;'>The oponent has left the game</p>" } );

                await pool.query("DELETE FROM rooms WHERE id = ?", [room[0].id]);

            }

        });

        */

    });

}
