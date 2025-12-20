
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './schemas/audit-log.schema';
import { CreateAuditLogDto } from './dto/audit-log.dto';

@Injectable()
export class AuditService {
    constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>) { }

    async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
        const createdLog = new this.auditLogModel(createAuditLogDto);
        return createdLog.save();
    }

    async findAll(): Promise<AuditLog[]> {
        return this.auditLogModel.find().sort({ timestamp: -1 }).exec();
    }
}
