import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ExampleService } from '../services/example.service';
import { CreateExampleDto } from '../dto/create-example.dto';
import { QueryDto } from '../../common/dto/query.dto';
import { UpdateExampleDto } from '../dto/update-example.dto';
import { ExampleEntity } from '../entities/example.entity';
import { DeleteMessage } from '../../common/interfaces/delete-message.interface';
import { ORDER_ENUM } from '../../common/constants';

@ApiTags('Example')
@ApiBearerAuth()
@Controller('example')
export class ExampleController {

  constructor(private readonly exampleService: ExampleService) { }

  @Post()
  create(@Body() createExampleDto: CreateExampleDto): Promise<ExampleEntity> {
    return this.exampleService.create(createExampleDto);
  }

  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get()
  findAll(@Query() queryDto: QueryDto): Promise<ExampleEntity[]> {
    return this.exampleService.findAll(queryDto);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ExampleEntity> {
    return this.exampleService.findOne(id);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateExampleDto: UpdateExampleDto): Promise<ExampleEntity> {
    return this.exampleService.update(id, updateExampleDto);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteMessage> {
    return this.exampleService.remove(id);
  }
}
