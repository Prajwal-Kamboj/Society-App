const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        maxlength: [ 50,'Name <50 characters']
    },
    slug: String,
    description:{
        type: String,
        required: [true, 'Please add a name'],
        maxlength:[500, 'Description less than 500 characters']
    },
    website:{
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20' ]
    },
    email:{
        type: String,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter a valid email address'
        ]
    },
    address:{
        type: String,
        
    },
    location:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            
          },
          coordinates: {
            type: [Number],
            
            index: '2dsphere'
          }
    },
    careers:{
        type: [String],
        require: true,
        enum:[
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'other'
        ]
    },
    averageRating:{
        type: Number,
        min:[1,'Rating must be at least 1'],
        max: [10, 'Rating cannot be more than 10'],
    },
    averageCost: Number,
    photo:{
        type: String,
        default: 'no-photo.jpg'
    },
    housing:{
        type: Boolean,
        default: false
    },
    jobAssistance:{
        type: Boolean,
        default: false
    },
    jobGuarantee:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default:Date.now
    }

},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}

});

// Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('remove', async function (next){
    console.log(`Courses being removed fron bootcamp ${this._id}`);
    await this.model('Course').deleteMany({bootcamp: this._id});
    next();
});

// Reverse populate with virtual
BootcampSchema.virtual('courses', {
    ref:'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
})


module.exports = mongoose.model('Bootcamp', BootcampSchema);