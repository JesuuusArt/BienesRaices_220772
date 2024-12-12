const admin = (req, res) => {
    res.render('properties/admin', {
        page: 'Mis propiedades',
        bar: true
    })
}

export { admin }