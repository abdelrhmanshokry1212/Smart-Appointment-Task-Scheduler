
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    text: string;

    @Prop({ required: true })
    time: string;

    @Prop({ default: false })
    read: boolean;

    @Prop({ required: true })
    userId: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
