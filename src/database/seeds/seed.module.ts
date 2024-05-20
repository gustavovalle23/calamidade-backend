import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/config/app.config';
import databaseConfig from 'src/config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { RoleSeedModule } from './user-role/role-seed.module';
import { StatusSeedModule } from './user-status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';
import { OrganizationSeedModule } from './organization/organization-seed.module';
import { RequestStatusSeedModule } from './request-status/request-status-seed.module';
import { RequestHelpTypeSeedModule } from './request-help-type/request-help-type-seed.module';
import { ReceiptSeedModule } from './receipt/receipt-seed.module';
import { ReceiptTypeSeedModule } from './receipt-type/receipt-type-seed.module';
import { RequestSeedModule } from './request/request-seed.module';
import { FileSeedModule } from './file/file-seed.module';
import { CooperatedSeedModule } from './cooperated/cooperated-seed.module';



@Module({
  imports: [
    RoleSeedModule,
    StatusSeedModule,
    ReceiptTypeSeedModule,
    ReceiptSeedModule,
    FileSeedModule,
    CooperatedSeedModule,
    UserSeedModule,
    OrganizationSeedModule,
    RequestSeedModule,
    RequestStatusSeedModule,
    RequestHelpTypeSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: [".env"],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
