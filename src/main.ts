import * as dotenv from "dotenv";
// tslint:disable-next-line
import "module-alias/register";

import Client from "./client";

dotenv.config();
(new Client()).start();
