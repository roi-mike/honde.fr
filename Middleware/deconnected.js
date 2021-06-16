const deconnected = async (req, res, next) => {
    req.session.destroy();
    res.setHeader('Content-Type', 'application/json');
    res.status(404);
    res.redirect('/');
    console.log('REQ : ', req.session);

}

module.exports = deconnected;