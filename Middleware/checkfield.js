const bcrypt = require('bcrypt');
const Mailer = require('../node_emailer/Mailer.js');
const nb_salt = 10;
const crypt_salt = bcrypt.genSaltSync(nb_salt);

const checkfield = async (req, res, next) => {

}




module.exports = checkfield;