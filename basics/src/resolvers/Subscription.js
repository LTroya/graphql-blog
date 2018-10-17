export default {
    comment: {
        subscribe(parent, {postId}, {db, pubsub}, info) {
            const post = db.posts.find(post => post.id === postId);
            if (!post) throw new Error(`Post ${postId} not found`);
            return pubsub.asyncIterator(`comment:${post.id}`);
        }
    },
    post: {
        subscribe(parent, args, {pubsub}, info) {
            return pubsub.asyncIterator('post');
        }
    }
}