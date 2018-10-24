export default {
    users(parent, args, {db, prisma}, info) {
        const opArgs = {};
        if (args.query) {
            opArgs.where = {
                OR: [
                    {name_contains: args.query},
                    {email_contains: args.query}
                ]
            }
        }
        return prisma.query.users(opArgs, info)
    },
    comments(parent, args, {db, prisma}, info) {
        const opArgs = {};
        return prisma.query.comments(opArgs, info);
    },
    posts(parent, args, {db, prisma}, info) {
        const opArgs = {};
        if (args.query) {
            opArgs.where = {
                OR: [
                    {title_contains: args.query},
                    {body_contains: args.query}
                ]
            };
        }
        return prisma.query.comments(opArgs, info);
        // if (!args.query) {
        //     return db.posts;
        // }
        //
        // return db.posts.filter(
        //     post => post.title.toLowerCase().includes(args.query.toLowerCase())
        //         || post.body.toLowerCase().includes(args.query.toLowerCase())
        // );
    }
};