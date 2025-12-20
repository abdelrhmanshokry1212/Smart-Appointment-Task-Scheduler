
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema()
export class AuditLog {
    @Prop({ required: true })
    action: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ default: Date.now })
    timestamp: Date;

    @Prop()
    details: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
