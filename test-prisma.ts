import { prisma } from './src/lib/prisma.ts';

async function main() {
  const result = await prisma.$queryRaw`SELECT 1`;
  console.log('DB OK:', result);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});