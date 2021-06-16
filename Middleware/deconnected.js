const deconnected = async (req, res, next) => {
    console.log('REQ : ', req.session);
    req.session.destroy();
    res.setHeader('Content-Type', 'application/json');
    res.status(404);
    res.redirect('/');
}

module.exports = deconnected;