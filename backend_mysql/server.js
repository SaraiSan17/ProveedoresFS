require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');
app.use(express.urlencoded());
app.use(express.json({ type: 'application/json' }));
app.use(cors());

app.use('/users',  require('./controladores/users.controller'));
app.use('/client',  require('./controladores/cliente.controller'));
app.use('/users',  require('./controladores/users.controller'));
app.use('/proyecto',  require('./controladores/proyecto.controller'));
app.use('/material',  require('./controladores/material.controller'));
app.use('/asignacion',  require('./controladores/asignacion.controller'));
app.use('/formato',  require('./controladores/formato.controller'));
app.use('/documento',  require('./controladores/documento.controller'));
app.use('/requisicion',  require('./controladores/requisicion.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));