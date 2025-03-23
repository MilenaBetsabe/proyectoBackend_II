import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: 'user',
    },
    cart: { 
        type: Schema.Types.ObjectId,
        ref: "Carts", 
    },
});

const User = mongoose.model("User", userSchema);

export default User;
