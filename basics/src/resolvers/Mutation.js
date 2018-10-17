import uuidv4 from "uuid/v4";

export default {
    createUser(parent, args, {db}, info) {
        const emailTaken = db.users.some(user => user.email.toLowerCase() === args.data.email.toLowerCase());
        if (emailTaken) {
            throw new Error(`Email ${args.data.email} is taken.`);
        }
        const user = {
            id: uuidv4(),
            ...args.data
        };
        db.users.push(user);
        return user;
    },
    deleteUser(parent, args, {db}, info) {
        const userIndex = db.users.findIndex(user => user.id === args.id);
        if (!~userIndex) throw new Error(`User ${args.id} not found`);
        const deletedUser = db.users.splice(userIndex, 1)[0];

        db.posts = db.posts.filter(post => {
            const match = post.author === deletedUser.id;
            if (match) {
                db.comments = db.comments.filter(comment => comment.post !== post.id);
            }
            return !match;
        });
        db.comments = db.comments.filter(comment => comment.author !== deletedUser.id);
        return deletedUser;
    },
    updateUser(parent, args, {db}, info) {
        const {id, data} = args;
        const user = db.users.find(user => user.id === id);
        if (!user) throw new Error(`User ${args.id} not found`);

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === data.email);
            if (emailTaken) throw new Error(`Email ${data.email} is taken`);
            user.email = data.email;
        }

        if (typeof data.name === 'string') {
            user.name = data.name
        }

        if (data.age) {
            user.age = data.age;
        }

        return user;
    },
    createPost(parent, args, {db}, info) {
        const userExists = db.users.find(user => user.id === args.data.author);
        if (!userExists) {
            throw new Error(`User ${args.data.author} not found`);
        }
        const post = {
            id: uuidv4(),
            ...args.data
        };
        db.posts.push(post);
        return post;
    },
    deletePost(parent, args, {db}, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id);
        if (!~postIndex) throw new Error(`Post ${args.id} does not exist`);
        const post = db.posts.splice(postIndex, 1)[0];
        db.comments = db.comments.filter(comment => comment.post !== post.id);
        return post;
    },
    updatePost(parent, args, {db}, info) {
        const {id, data} = args;
        const post = db.posts.find(post => post.id === id);
        if (!post) throw new Error(`Post ${args.post} not found`);

        post.title = data.title || post.title;
        post.body = data.body || post.body;
        post.published = data.published || post.published;

        return post;
    },
    createComment(parent, args, {db, pubsub}, info) {
        const authorExists = db.users.find(user => user.id === args.data.author);
        const postExists = db.posts.find(p => p.id === args.data.post);
        if (!authorExists) throw new Error(`User ${args.data.author} does not exist`);
        if (!postExists) throw new Error(`Post ${args.data.post} does not exist`);
        const comment = {
            id: uuidv4(),
            ...args.data
        };
        db.comments.push(comment);
        pubsub.publish(`comment:${args.data.post}`, {comment});
        return comment;
    },
    deleteComment(parent, args, ctx, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id);
        if (!~commentIndex) throw new Error(`Comment ${args.id} does not exist`);
        return db.comments.splice(commentIndex, 1)[0];
    },
    updateComment(parent, args, {db}, info) {
        const {id, data} = args;
        const comment = db.comments.find(comment => comment.id === id);
        if (!comment) throw new Error(`Comment ${id} not found!`);
        comment.text = data.text || comment.text;
        return comment;
    }
}