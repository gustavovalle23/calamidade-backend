
import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './user-role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './user-status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { OrganizationSeedService } from './organization/organization-seed.service';
import { CooperatedSeedService } from './cooperated/cooperated-seed.service';
import { RequestStatusSeedService } from './request-status/request-status-seed.service';
import { RequestHelpTypeSeedService } from './request-help-type/request-help-type-seed.service';
import { ReceiptSeedService } from './receipt/receipt-seed.service';
import { ReceiptTypeSeedService } from './receipt-type/receipt-type-seed.service';
import { RequestSeedService } from './request/request-seed.service';
import { FileSeedService } from "./file/file-seed.service";

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(UserSeedService).run();
  await app.get(ReceiptTypeSeedService).run();
  await app.get(ReceiptSeedService).run();
  await app.get(CooperatedSeedService).run();
  await app.get(FileSeedService).run();
  await app.get(OrganizationSeedService).run();
  await app.get(ReceiptSeedService).run();
  await app.get(RequestStatusSeedService).run();
  await app.get(RequestHelpTypeSeedService).run();
  await app.get(RequestSeedService).run();

  await app.close();
};

void runSeed();
