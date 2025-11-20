import { Module } from '@nestjs/common';
import { CapitalGainsModule } from '../capital-gains/capital-gains.module';
import { CLIService } from './cli.service';

import { CLI_FRAMEWORK } from './domain/ports/cli-framework.port';
import { INPUT_READER } from './domain/ports/input-reader.port';
import { OUTPUT_WRITER } from './domain/ports/output-writer.port';

import { StdinReaderAdapter } from './infrastructure/adapters/input/stdin-reader.adapter';
import { ConsoleWriterAdapter } from './infrastructure/adapters/output/console-writer.adapter';

import { JsonPresenter } from './infrastructure/presenters/json-presenter';
import { TablePresenter } from './infrastructure/presenters/table-presenter';

import { ProcessSingleLineUseCase } from './application/use-cases/process-single-line.use-case';
import { ProcessOperationsBatchUseCase } from './application/use-cases/process-operations-batch.use-case';
import { ReadInputFromStdinUseCase } from './application/use-cases/read-input-from-stdin.use-case';
import { ReadInputFromFileUseCase } from './application/use-cases/read-input-from-file.use-case';
import { RunTestsUseCase } from './application/use-cases/run-tests.use-case';
import { RunInteractiveModeUseCase } from './application/use-cases/run-interactive-mode.use-case';
import { InkReactAdapter } from './infrastructure/adapters/cli-framework/ink-react.adapter';
import { InteractiveProcessorService } from './application/services/interactive-processor.service';
import { INTERACTIVE_UI } from './domain/ports/interactive-ui.port';
import { InquirerAdapter } from './infrastructure/adapters/interactive-ui/inquirer.adapter';
import { FILE_SYSTEM } from './domain/ports/file-system.port';
import { NodeFileSystemAdapter } from './infrastructure/adapters/file-system/node-fs.adapter';

@Module({
  imports: [CapitalGainsModule],
  providers: [
    { provide: CLI_FRAMEWORK, useClass: InkReactAdapter },
    { provide: INPUT_READER, useClass: StdinReaderAdapter },
    { provide: OUTPUT_WRITER, useClass: ConsoleWriterAdapter },
    { provide: INTERACTIVE_UI, useClass: InquirerAdapter },
    { provide: FILE_SYSTEM, useClass: NodeFileSystemAdapter },
    JsonPresenter,
    TablePresenter,
    ProcessSingleLineUseCase,
    ProcessOperationsBatchUseCase,
    ReadInputFromStdinUseCase,
    ReadInputFromFileUseCase,
    RunTestsUseCase,
    RunInteractiveModeUseCase,
    InteractiveProcessorService,
    CLIService,
  ],
  exports: [CLIService, InteractiveProcessorService],
})
export class CLIModule {}
