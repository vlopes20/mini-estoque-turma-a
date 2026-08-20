import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) { }

  async criar(dados: CreateProdutoDto) {
    const produtoExistente = await this.prisma.produto.findFirst({
      where: { nome: dados.nome }
    });

    if (produtoExistente) {
      throw new ConflictException("Já existe um produto com esse nome.")
    };

    return this.prisma.produto.create({
      data: dados
    });
  }

  listarTodos() {
    return this.prisma.produto.findMany();
  }

  async buscarPorId(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id }
    });

    if (!produto) {
      throw new ConflictException(`Não existe um produto com ID:${id} cadastrado.`)
    };

    return produto;
  }

  async atualizar(id: number, dados: UpdateProdutoDto) {
    await this.buscarPorId(id);

    if (dados.nome) {
      const produtoExistente = await this.prisma.produto.findFirst({
        where: {
          nome: dados.nome,
          NOT: {id}
        }
      });

      if (produtoExistente) { 
        throw new ConflictException(`Ja existe outro produto cadastrado com esse nome`)
      }
    };

    return this.prisma.produto.update({
      where: {id},
      data: dados
    });
  }

  async remover(id: number) {
    await this.buscarPorId(id)

    return this.prisma.produto.delete({
      where: { id }
    });
  }
}
