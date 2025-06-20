import { Global, Module, DynamicModule } from '@nestjs/common';
import { Web3Service } from 'service/web3';
import Web3 from 'web3';

@Global()
@Module({
    providers: [Web3Service],
    exports: [Web3Service],
})
export class Web3Module {
    static forRoot(infuraUrl: string): DynamicModule {
        return {
            module: Web3Module,
            providers: [
                {
                    provide: Web3Service,
                    useFactory: () => new Web3Service(new Web3(infuraUrl)),
                },
            ],
        };
    }
}
