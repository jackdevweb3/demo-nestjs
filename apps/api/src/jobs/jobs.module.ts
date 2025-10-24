import {Module} from '@nestjs/common';

import {PersistenceModule} from '../persistence/persistence.module';
import {ScheduleModule} from '@nestjs/schedule';   
import { SampleJob } from './sample.job';

@Module({
    imports: [ScheduleModule.forRoot(), PersistenceModule],
    controllers: [],
    providers: [
        SampleJob
    ],
    exports: [],
})
export class JobsModule {
}
