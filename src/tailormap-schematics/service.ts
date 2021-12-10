import { strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  externalSchematic,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { Schema } from '@schematics/angular/service/schema';
import { getWorkspace, buildDefaultPath } from '@schematics/angular/utility/workspace';
import { parseName } from '@schematics/angular/utility/parse-name';

type TailormapServiceOptions = Schema & { httpService?: boolean };

export const service = (options: TailormapServiceOptions): Rule => {
  return async (host: Tree) => {
    if (options.skipTests) {
      delete options.httpService;
      return externalSchematic('@schematics/angular', 'service', options);
    }

    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project as string);

    if (options.path === undefined && project) {
      options.path = buildDefaultPath(project);
    }

    const parsedPath = parseName(options.path as string, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const specFileTemplateSource = apply(url('./files/service'), [
      template({
        ...strings,
        'if-flat': (s: string) => (options.flat ? '' : s), // create service folder or not
        ...options,
      }),
      move(parsedPath.path),
    ]);

    const angularServiceOptions = {
      ...options,
      ...getAngularServiceExtensions(workspace.extensions),
      ...getAngularServiceExtensions(project?.extensions),
    };
    delete angularServiceOptions.httpService;

    return chain([
      externalSchematic('@schematics/angular', 'service', {
        ...angularServiceOptions,
        skipTests: true,
      }),
      mergeWith(specFileTemplateSource, MergeStrategy.Overwrite),
    ]);
  };
};

const getAngularServiceExtensions = (extensions: any) => {
  if (extensions?.schematics && extensions.schematics['@schematics/angular:service'])
  {
    return extensions.schematics['@schematics/angular:service'];
  }

  return {};
};
