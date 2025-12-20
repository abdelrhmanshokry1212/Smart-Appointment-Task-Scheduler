
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema()
export class Appointment {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    date: string;

    @Prop({ required: true })
    time: string;

    @Prop({ required: true })
    category: string;

    @Prop({ default: 'Upcoming' })
    status: string;

    @Prop()
    notes: string;

    @Prop()
    fileUrl: string;

    @Prop({ required: true })
    userId: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
