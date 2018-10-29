import getUserId from '../utils/getUserId';

export default {
    users(parent, args, {prisma}, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip
        };
        if (args.query) {
            opArgs.where = {
                OR: [
                    {name_contains: args.query}
                ]
            }
        }
        return prisma.query.users(opArgs, info)
    },
    comments(parent, args, {prisma}, info) {
        const opArgs = {};
        return prisma.query.comments(opArgs, info);
    },
    posts(parent, args, {prisma}, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            where: {
                published: true
            }
        };
        if (args.query) {
            opArgs.where.OR = [
                {title_contains: args.query},
                {body_contains: args.query}
            ];
        }
        return prisma.query.posts(opArgs, info);
    },
    myPosts(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        const opArgs = {};
        if (args.query) {
            opArgs.where = {
                OR: [
                    {title_contains: args.query},
                    {body_contains: args.query}
                ],
                author: {
                    id: userId
                }
            };
        }
        return prisma.query.posts(opArgs, info);
    },
    me(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        return prisma.query.user({
            where: {id: userId}
        });
    },
    async post(parent, args, {prisma, request}, info) {
        const userId = getUserId(request, false);
        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{
                    published: true
                }, {
                    author: {
                        id: userId
                    }
                }]
            }
        }, info);
        if (!posts.length) {
            throw new Error('Post not found');
        }
        return posts[0];
    }
};