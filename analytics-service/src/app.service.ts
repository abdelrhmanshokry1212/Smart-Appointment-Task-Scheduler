import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) { }

  async getProductivity(userId: string): Promise<any> {
    try {
      // Call Appointment Service (assuming it runs on port 3002)
      const { data: appointments } = await firstValueFrom(
        this.httpService.get(`http://127.0.0.1:3002/appointments/user/${userId}`)
      );

      const total = appointments.length;
      if (total === 0) return { score: 0, total: 0, completed: 0, message: 'No tasks yet' };

      const completed = appointments.filter((app: any) => app.status === 'Completed').length;
      const score = Math.round((completed / total) * 100);

      return {
        score,
        total,
        completed,
        message: this.getEncouragement(score)
      };
    } catch (error) {
      console.error('Error fetching appointments for analytics:', error.message);
      // Return zero values if user has no appointments or service is down
      return { score: 0, total: 0, completed: 0, error: 'Could not calculate score' };
    }
  }

  private getEncouragement(score: number): string {
    if (score === 100) return 'Perfect! You are a machine! 🚀';
    if (score >= 80) return 'Excellent work! Keep it up! 🌟';
    if (score >= 50) return 'Good job! You are getting there. 💪';
    return 'Let\'s knock out some tasks! 🔥';
  }
}
