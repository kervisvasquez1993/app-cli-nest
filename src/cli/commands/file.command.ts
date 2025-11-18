import { CapitalGainsController } from '../../capital-gains/capital-gains.controller';
import * as fs from 'fs';

export class FileCommand {
  constructor(private readonly controller: CapitalGainsController) {}

  execute(filePath: string): void {
    console.log(`📂 Procesando archivo: ${filePath}\n`);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Error: Archivo no encontrado: ${filePath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter((line) => line.trim() !== '');

    lines.forEach((line, index) => {
      try {
        const result = this.controller.processLine(line);
        console.log(result);
      } catch (error) {
        console.error(`❌ Error en línea ${index + 1}: ${error.message}`);
      }
    });

    console.log('\n✅ Archivo procesado exitosamente');
    process.exit(0);
  }
}