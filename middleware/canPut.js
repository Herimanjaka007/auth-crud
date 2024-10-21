const canPut = async (req, res, next) => {
    const ADMIN = "ADMIN";
    const isAdmin = ({ role }) => role === ADMIN;
    const isOwner = ({ id }) => id === Number(req.params.id);

    if (isAdmin(req.user) || isOwner(req.user)) {
        return next();
    }
    return res.status(500).json({
        message: "Unauthorized. You can only modify your own information."
    });
}

export default canPut;