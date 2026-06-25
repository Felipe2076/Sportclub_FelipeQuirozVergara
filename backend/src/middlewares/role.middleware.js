function authorizeRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ ok: false, message: 'Usuario no autenticado.' });
        }

        if (allowedRoles && !allowedRoles.includes(req.user.role.toLowerCase())) {
            return res.status(403).json({
                ok: false,
                message: 'Acceso denegado. No tienes los permisos necesarios.'
            });
        }

        next();
    };
}

module.exports = { authorizeRole };
