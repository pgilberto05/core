import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Get,
  Delete,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/create-user.use-case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserUseCase } from '../../application/update-user.use-case';
import { DeleteUserUseCase } from '../../application/delete-user.use-case';
import { FindUserUseCase } from '../../application/find-user.use-case';
import { ListUserUseCase } from '../../application/list-users.use-case';
import { UpdateUserDto } from '../../application/dto/update-user.dto';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUserCase: UpdateUserUseCase,
    private readonly deleteUserUserCase: DeleteUserUseCase,
    private readonly findUserUserCase: FindUserUseCase,
    private readonly listUserUserCase: ListUserUseCase,
  ) {}

  @ApiOperation({ summary: 'Listar usuarios' })
  @ApiResponse({ status: 200, description: 'Listar usuarios' })
  @Get()
  async list() {
    await this.listUserUserCase.execute();
    return { message: 'User created' };
  }

  @ApiOperation({ summary: 'Buscar usuarios' })
  @ApiResponse({ status: 200, description: 'Buscar usuarios' })
  @Get()
  async find(@Param('id', ParseIntPipe) id: number) {
    await this.findUserUserCase.execute(id);
    return { message: 'User encontrado' };
  }

  @ApiOperation({ summary: 'Crear usuarios' })
  @ApiResponse({ status: 200, description: 'Crear usuarios' })
  @Post()
  async create(@Body() dto: CreateUserDto) {
    await this.createUserUseCase.execute(dto);
    return { message: 'User created' };
  }

  @ApiOperation({ summary: 'Actualizar usuarios' })
  @ApiResponse({ status: 200, description: 'Actualizar usuarios' })
  @Patch()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    await this.updateUserUserCase.execute(id, dto);
    return { message: 'User updated' };
  }

  @ApiOperation({ summary: 'Actualizar usuarios' })
  @ApiResponse({ status: 200, description: 'Actualizar usuarios' })
  @Delete()
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteUserUserCase.execute(id);
    return { message: 'User deleted' };
  }
}
