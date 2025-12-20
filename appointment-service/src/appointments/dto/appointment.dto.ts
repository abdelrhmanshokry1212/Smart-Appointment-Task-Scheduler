
export class CreateAppointmentDto {
    title: string;
    date: string;
    time: string;
    category: string;
    userId: string;
    notes?: string;
    fileUrl?: string;
}

export class UpdateAppointmentDto {
    title?: string;
    date?: string;
    time?: string;
    category?: string;
    status?: string;
    fileUrl?: string;
}
