import { Controller, Get } from '@nestjs/common';
import { LinkService } from './link.service';

@Controller('api/link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get('list')
  list() {
    return this.linkService.findAll();
  }
}
