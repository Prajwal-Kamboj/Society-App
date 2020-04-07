const mongoose = require('mongoose');

const ResidentSchema = new mongoose.Schema({
    name:{
        type: String,
        // required: [true, 'Please add a name'],
        unique: true,
        maxlength: [ 50,'Name <50 characters']
    },
    slug: String,
    
    
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
    city:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            
          },
          coordinates: {
            type: [Number],
            
            index: '2dsphere'
          }
    },
    state:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            
          },
          coordinates: {
            type: [Number],
            
            index: '2dsphere'
          }
    },
    pincode: {
        type: [Number],
        default: 110075
    },
    familyMembers:{
        type: [Number],
        require: true,
        default: 1
        
    },
    
    rent:{
        type: Boolean,
        default: false
    },
    owner:{
        type: Boolean,
        default: true
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
// BootcampSchema.pre('remove', async function (next){
//     console.log(`Courses being removed fron bootcamp ${this._id}`);
//     await this.model('Course').deleteMany({bootcamp: this._id});
//     next();
// });

// Reverse populate with virtual
// BootcampSchema.virtual('courses', {
//     ref:'Course',
//     localField: '_id',
//     foreignField: 'bootcamp',
//     justOne: false
// })


module.exports = mongoose.model('Resident', ResidentSchema);