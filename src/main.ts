import * as dotenv from "dotenv";
// tslint:disable-next-line
import "module-alias/register";

import Client from "./Client";

dotenv.config();
new Client().start();
