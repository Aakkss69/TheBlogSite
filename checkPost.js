const _ = require("lodash");

exports.checkKey = (Post, title) => {
  return new Promise((resolve, reject) => {
    let obj = {
      found: false,
      postTitle: "",
      postContent: "",
    };

    Post.find()
      .exec()
      .then((posts) => {
        posts.some((post) => {
          if (_.lowerCase(post.postTitle) === _.lowerCase(title)) {
            obj = {
              found: true,
              postTitle: post.postTitle,
              postContent: post.postContent,
            };
            return true;
          }
        });
        resolve(obj); // Resolve the promise with the final obj
      })
      .catch((err) => {
        console.log(err);
        reject(err); // Reject the promise if there's an error
      });
  });
};
