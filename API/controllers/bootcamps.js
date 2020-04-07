const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require ('../utils/errorResponse');




// desc - Get all bootcamps
//@route Get /api/v1/bootcamps
//@access   Public
exports.getBootcamps = async (req,res,next)=>{
    let query;
    // copy req.query
    const reqQuery = {...req.query};

    // Fields to exclude
    const removeFields = ['select','sort','page','limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // creqte query string
    let queryStr = JSON.stringify(reqQuery);

    //create ops like ($gt,$gte)
    querStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    // Select fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);


    }else{
        query = query.sort('name');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);



    //executing query
    try {
        const bootcamp = await query ;
        

        //pagination result
        const pagination = {};
        if(endIndex <total){
            pagination.next = {
                page: page+1,
                limit
            }
        }

        if(startIndex >0){
            pagination.prev = {
                page:page-1,
                limit
            }
        }

        res.status(200).json({ success: true,count:bootcamp.length, pagination, data: bootcamp});
        
    } catch (err) {
        res.status(400).json({success:false});
    }

    

}


// desc - Get single bootcamp
//@route Get /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = async (req,res,next)=>{
    try {
        const bootcamp = await Bootcamp.findById(req.params.id) ;
       
        
        if(!bootcamp){
            res.status(400).json({success:false});
        }
        else{
            res.status(200).json({ success: true,count:bootcamp.length, data: bootcamp});
        }
        
    } catch (err) {
        // res.status(400).json({success:false });
        next(
            new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
        );
    }
   
}


// desc - Create new bootcamp
//@route POST /api/v1/bootcamps/:id
//@access   Private
exports.createBootcamp = async (req,res,next)=>{
    try {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success : true,
            data: bootcamp
        });
        
    } catch (err) {
        next(new ErrorResponse('Cannot create Bootcamp'),404);
    }
   
};



// desc - update bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamp = async (req,res,next)=>{
    
      try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
          });
        
          res.status(200).json({ success: true, data: bootcamp });
        
    } catch (err) {
        res.status(400).json({success:false});
    }
}

// desc - Delete bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = async (req,res,next)=>{
    try {
        const bootcamp = await Bootcamp.findById(req.params.id) ;

        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not fount with id ${req.params.id}`,404)
            );
        }

        bootcamp.remove();


        res.status(200).json({ success: true, data: bootcamp});
        
    } catch (err) {
        next(
            new ErrorResponse(`Bootcamp not fount with id ${req.params.id}`,404)
        );
    }
}