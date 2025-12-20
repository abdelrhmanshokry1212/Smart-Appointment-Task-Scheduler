
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuditService } from './audit.service';
import { CreateAuditLogDto } from './dto/audit-log.dto';

@Controller('logs')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Post()
    create(@Body() createAuditLogDto: CreateAuditLogDto) {
        return this.auditService.create(createAuditLogDto);
    }

    @Get()
    findAll() {
        return this.auditService.findAll();
    }
}
