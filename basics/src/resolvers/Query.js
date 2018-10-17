export default {
    users(parent, args, {db}, info) {
        if (!args.query) {
            return db.users;
        }

        return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    me() {
        return {
            id: '1234',
            name: 'Luis Troya',
            email: 'troyaluis56@gmail.com',
            age: 26
        }
    },
    comments(parent, args, {db}, info) {
        if (!args.query) {
            return db.comments;
        }
        return db.comments.filter(comment => comment.text.toLowerCase().includes(args.query.toLowerCase()))
    },
    posts(parent, args, {db}, info) {
        if (!args.query) {
            return db.posts;
        }

        return db.posts.filter(
            post => post.title.toLowerCase().includes(args.query.toLowerCase())
                || post.body.toLowerCase().includes(args.query.toLowerCase())
        );
    }
};