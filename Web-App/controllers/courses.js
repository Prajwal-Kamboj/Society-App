const Course = require('../models/Course');
const ErrorResponse = require ('../utils/errorResponse');
const Bootcamp= require('../models/Bootcamp');


// desc - Get all bootcamps
//@route Get /api/v1/bootcamps
//@access   Public

exports.getCourses = async(req,res,next) =>{
    let query;

    if(req.params.bootcampId){
        query = Course.find({ bootcamp: req.params.bootcampId});
    }else{
        query = Course.find().populate({
            path: 'bootcamp',
            select:' name description'
        });
    }

    try {
        const courses = await query;
        
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        next(
            new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
        );
    }
}

exports.getCourse = async(req,res,next) =>{
    

    try {
        const courses = await Course.findById(req.params.id).populate({
            path: 'bootcamp',
            select: 'name description'
        });

        if(!courses){
            return next(new ErrorResponse(`Course not found with id${req.params.id}`, 404));
        }
        
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        next(
            new ErrorResponse(`Course not found with id${req.params.id}`, 404)
        );
    }
}


// desc - Add course
//@route Get /api/v1/bootcamps/:bootcampId/courses
//@access   private

exports.addCourse = async(req,res,next) =>{
    req.body.bootcamp= req.params.bootcampId;
    try {
        const bootcamp = await Bootcamp.findById(req.params.bootcampId);

        if(!bootcamp){
            return next(new ErrorResponse(`No bootcamp found with id${req.params.id}`, 404));
        }
        
    } catch (error) {
        next(error);
    }
    
    

    try {
        
        const course = await Course.create(req.body);
        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        next(
            new ErrorResponse(`Server error`, 404)
        );
    }
}