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

type TailormapServiceOptions = Schema & { httpService: boolean };

export const service = (options: TailormapServiceOptions): Rule => {
  return async (host: Tree) => {
    const { httpService, ..._options } = options;
    if (_options.skipTests) {
      return externalSchematic('@schematics/angular', 'service', _options);
    }

    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(_options.project as string);

    if (_options.path === undefined && project) {
      _options.path = buildDefaultPath(project);
    }

    const parsedPath = parseName(_options.path as string, _options.name);
    _options.name = parsedPath.name;
    _options.path = parsedPath.path;

    const specFileTemplateSource = apply(url('./files/service'), [
      template({
        ...strings,
        'if-flat': (s: string) => (_options.flat ? '' : s), // create service folder or not
        ...{ _options, httpService },
      }),
      move(parsedPath.path),
    ]);

    const angularServiceOptions = {
      ..._options,
      ...getAngularServiceExtensions(workspace.extensions),
      ...getAngularServiceExtensions(project?.extensions),
    };

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
