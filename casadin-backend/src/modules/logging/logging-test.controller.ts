import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoggingService } from './logging.service';

@Controller('log-test')
export class LoggingTestController {
  constructor(private readonly loggingService: LoggingService) {}

  @Post()
  @HttpCode(200)
  async test(@Body() body: any) {
    const payload = body && Object.keys(body).length ? body : { test: true };
    const result = await this.loggingService.log('TEST', payload, { source: 'log-test-endpoint' });
    return { ok: !!result, result };
  }

  @Get('csv')
  async getCsvLogs(@Res() res: Response) {
    const csv = await this.loggingService.generateCsvLogs();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="logs.csv"');
    res.send(csv);
  }
}
