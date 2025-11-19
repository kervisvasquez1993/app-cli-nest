// src/cli/cli.module.ts
import { Module } from '@nestjs/common';
import { CapitalGainsModule } from '../capital-gains/capital-gains.module';
import { CLIService } from './cli.service';
import { CommanderAdapter } from './infrastructure/adapters/commander.adapter';
import { StdinReaderAdapter } from './infrastructure/adapters/stdin-reader.adapter';
import { ConsoleWriterAdapter } from './infrastructure/adapters/console-writer.adapter';
import { ProcessStdinUseCase } from './application/use-cases/process-stdin.use-case';
import { ProcessFileUseCase } from './application/use-cases/process-file.use-case';
import { RunTestsUseCase } from './application/use-cases/run-tests.use-case';
import { CLI_ADAPTER } from './domain/ports/cli-adapter.interface';
import { INPUT_READER } from './domain/ports/input-reader.interface';
import { OUTPUT_WRITER } from './domain/ports/output-writer.interface';

@Module({
  imports: [CapitalGainsModule],
  providers: [
    { provide: CLI_ADAPTER, useClass: CommanderAdapter },
    { provide: INPUT_READER, useClass: StdinReaderAdapter },
    { provide: OUTPUT_WRITER, useClass: ConsoleWriterAdapter },

    ProcessStdinUseCase,
    ProcessFileUseCase,
    RunTestsUseCase,

    CLIService,
  ],
  exports: [CLIService],
})
export class CLIModule {}
