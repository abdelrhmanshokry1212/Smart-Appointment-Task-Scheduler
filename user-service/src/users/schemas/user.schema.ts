
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false })
    profilePhotoUrl: string;

    @Prop({ required: false })
    jobTitle: string;

    @Prop({ required: false })
    phoneNumber: string;

    @Prop({ required: false })
    bio: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
