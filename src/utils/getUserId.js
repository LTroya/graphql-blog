import jwt from 'jsonwebtoken';

const getUserId = (req, requireAuth = true) => {
    const header = req.request
        ? req.request.headers.authorization
        : req.connection.context.Authorization;

    if (header) {
        const token = header.replace('Bearer ', '');
        const decoded = jwt.verify(token, 'MY_SECRET_VALUE');

        return decoded.userId;
    }

    if (requireAuth) {
        throw new Error('Authentication required');
    }

    return null;
};

export {getUserId as default};