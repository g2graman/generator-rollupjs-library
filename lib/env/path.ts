import { camelCase } from 'lodash';
import { FLAGS } from "../../config/env/flags";

const getEnvPathFromFlag = camelCase;

export class EnvPath {
  public static get(flagName: string) {
    const modifiedFlagName = flagName.lastIndexOf('_FLAG') > -1
      ? flagName
      : `${flagName}_FLAG`;

    return getEnvPathFromFlag(FLAGS[modifiedFlagName]);
  }
}

export default EnvPath;
