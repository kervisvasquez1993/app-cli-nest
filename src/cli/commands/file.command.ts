import { CapitalGainsService } from '../../capital-gains/capital-gains.service';
import { OperationDto } from '../../capital-gains/dto/operation.dto';
import * as fs from 'fs';

export class FileCommand {
  constructor(private readonly service: CapitalGainsService) {}

  execute(filePath: string): void {
    console.log(`📂 Procesando archivo: ${filePath}\n`);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Error: Archivo no encontrado: ${filePath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter((line) => line.trim() !== '');

    lines.forEach((line) => {
      try {
        const operations: OperationDto[] = JSON.parse(line);
        const results = this.service.processOperations(operations);
        console.log(JSON.stringify(results));
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
      }
    });

    console.log('\n✅ Archivo procesado exitosamente');
    process.exit(0);
  }
}
