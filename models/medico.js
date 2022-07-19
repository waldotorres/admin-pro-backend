const {Schema, model} = require('mongoose');

const MedicoSchema = Schema ({

nombre:{
    type:String,
    required:true
},
img:{
    type:String
},
usuario:{
    type: Schema.Types.ObjectId,
    ref:'Usuario',
    required:true
},

hospital:{
    required:true,
    type: Schema.Types.ObjectId,
    ref:'Hospital'
}

} );

MedicoSchema.method('toJSON', function() {
    const { __v, ...object } =  this.toObject();
    return object;
})


module.exports = model( 'Medico', MedicoSchema );


