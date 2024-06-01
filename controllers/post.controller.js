const Post = require('../models/post.model');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const createPost = async (req, res) => {
    try {
      const { content, postTime } = req.body;
  
      const newPost = new Post({
        content,
        postTime
      });
      console.log(postTime); 
      await newPost.save();
  
      res.status(201).json({ success: true, data: newPost, message: 'Post created successfully' });
    } catch (error) {
      console.error('Error creating post:', error.message);
      res.status(500).json({ success: false, message: 'Error creating post' });
    }
  };


const sendEmail = async (postData) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kramsai122000@gmail.com',
            pass: 'qutu nokb fdtx ggrv'
        }
    });

    const mailOptions = {
        from: 'kramsai122000@gmail.com',
        to: 'kramsai122000@gmail.com',
        subject: 'Post',
        text: `\n\nContent: ${postData.content}\nPost Time: ${postData.postTime}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ postTime: -1 }); 

        res.status(200).json({ success: true, data: posts });
    } 
    catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching posts' });
    }
};

module.exports = { createPost, getPosts,sendEmail};