const mongoose = require("mongoose")

const UserDetailSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {type: String, unique: true },
    mobile: String,
    password: String,
    image:String,
    gender:String,
    profession:String,
    name: String,
},{
    collection:"UserInfo"
});
mongoose.model  ("UserInfo", UserDetailSchema);