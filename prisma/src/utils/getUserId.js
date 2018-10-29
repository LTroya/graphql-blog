import jwt from 'jsonwebtoken';

const getUserId = (req) => {
    const header = req.request.headers.authorization;
    if (!header) throw new Error('Authentication required');

    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, 'MY_SECRET_VALUE');

    return decoded.userId;
};

export {getUserId as default};