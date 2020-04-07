const express = require('express');
const {getCourses, getCourse,addCourse}
= require('../controllers/courses');
const {protect} = require('../middleware/auth'); 


const router = express.Router({mergeParams: true});



router.route('/').get(getCourses).post(protect,addCourse);
router.route('/:id').get(getCourse);
module.exports = router;