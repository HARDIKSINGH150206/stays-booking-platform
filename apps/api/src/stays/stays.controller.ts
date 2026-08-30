import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListStaysDto } from './dto/list-stays.dto';
import { StaysService } from './stays.service';

@Controller('stays')
export class StaysController {
  constructor(private readonly staysService: StaysService) {}

  @Get()
  findAll(@Query() query: ListStaysDto) {
    return this.staysService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staysService.findOne(id);
  }
}
