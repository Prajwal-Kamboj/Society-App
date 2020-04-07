const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path:'./config/config.env'});

const Bootcamp = require ('./models/Bootcamp');
const Course = require ('./models/Course');


mongoose.connect(process.env.MONGO_URI,{
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser: true,
    useUnifiedTopology: true

});

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));


const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);

        console.log('Data Imported');
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Data destroyed');
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

if(process.argv[2]=== '-i')
{
 importData();
}else if (process.argv[2]==='-d'){
    deleteData();
}