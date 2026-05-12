const { z } = require('zod');

const tituloSchema = z.object({
  numeroDocumento: z.string().min(1),
  cpfCnpj: z.string().min(11),
  cliente: z.string().min(1),

  nossoNumero: z.string().min(1),

  linhaDigitavel: z.string().min(10),

  valorTitulo: z.number(),

  valorPago: z.number(),

  juros: z.number().nullable(),

  dataPagamento: z.any().nullable(),

  dataLiquidacao: z.any().nullable()
});

module.exports = tituloSchema;