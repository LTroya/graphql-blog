export default {
    author(parent, args, {db}, info) {
        return db.users.find(user => parent.author === user.id);
    },
    comments(parent, args, {db}, info) {
        return db.comments.filter(comment => comment.post === parent.id);
    }
}