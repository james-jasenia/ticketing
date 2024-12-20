import mongoose from "mongoose";
import Password from "../services/password";

// Typescript's type checking and Mongoose require a bit of massaging.
// An interface to provide type checking in a User factory method.
interface UserAttrs {
    email: string;
    password: string;
}

// An interface to provide additional type context to User Model.
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has
// Mongoose may add additional properties to a document. We want some type checking on them.
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;   
        }
    }
});

userSchema.pre('save', async function(done) {
   if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
   }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;