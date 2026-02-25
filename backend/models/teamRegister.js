const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamRegister= new Schema(
    {    

          name:{
            type:String,
            required:true
          },
          role: {
            type: String,
            required: true,
          },
          imageUrl: {
            type: String,
            required: true,
          },
          imageId: {
            type: String,
            required: true
          },


          insta:{
            type:String,
            required:false
          },

          linkedin:{
            type:String,
            required:false
          },

          facebook:{
            type:String,
            required:false
          },

         
    },
    {timestamps:true}
);

const TeamRegisterModel = mongoose.model("team_details",teamRegister);

module.exports = TeamRegisterModel;