import { Path, strings } from '@angular-devkit/core';
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
import { Schema as TailormapComponentOptions } from '@schematics/angular/component/schema';
import { getWorkspace, buildDefaultPath } from '@schematics/angular/utility/workspace';
import * as findModule from '@schematics/angular/utility/find-module';
import { parseName } from '@schematics/angular/utility/parse-name';

interface ModuleDetails {
  moduleName: string;
  relativePath: string;
}

export const defaultModuleDetails: ModuleDetails = {
  moduleName: '',
  relativePath: '',
};

export const component = (options: TailormapComponentOptions): Rule => {
  return async (host: Tree) => {

    if (options.skipTests) {
      return externalSchematic('@schematics/angular', 'component', options);
    }

    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project as string);

    if (options.path === undefined && project) {
      options.path = buildDefaultPath(project);
    }

    const parsedPath = parseName(options.path as string, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    options.selector = options.selector || buildSelector(options, project && project.prefix || '');

    const moduleDetails = options.skipImport
      ? defaultModuleDetails
      : getModuleDetails(options, host);

    const specFileTemplateSource = apply(url('./files'), [
      template({
        ...strings,
        'if-flat': (s: string) => (options.flat ? '' : s), // create component folder or not
        ...options,
        ...moduleDetails,
      }),
      move(parsedPath.path),
    ]);

    const angularComponentOptions = {
      ...options,
      ...getAngularComponentExtensions(workspace.extensions),
      ...getAngularComponentExtensions(project?.extensions),
    };

    return chain([
      externalSchematic('@schematics/angular', 'component', {
        ...angularComponentOptions,
        skipTests: true,
      }),
      mergeWith(specFileTemplateSource, MergeStrategy.Overwrite),
    ]);
  };
};

const getModuleDetails = (
  options: TailormapComponentOptions,
  host: Tree,
): ModuleDetails => {
  const modulePath = findModule.findModuleFromOptions(host, options) as Path;
  const componentPath = `/${options.path}/`
    + (options.flat ? '' : strings.dasherize(options.name) + '/')
    + strings.dasherize(options.name)
    + '.component';
  const relativePath = findModule.buildRelativePath(componentPath, modulePath);
  const moduleFileName = modulePath.split('/').pop() as string;

  const moduleName = moduleFileName.replace('.module.ts', '');
  const moduleRelativePath = relativePath.replace('.module.ts', '');

  return { relativePath: moduleRelativePath, moduleName };
};

const getAngularComponentExtensions = (extensions: any) => {
  if (extensions?.schematics && extensions.schematics['@schematics/angular:component'])
  {
    return extensions.schematics['@schematics/angular:component'];
  }

  return {};
};

const buildSelector = (options: TailormapComponentOptions, projectPrefix: string) => {
  let selector = strings.dasherize(options.name);
  if (options.prefix) { // use prefix from options if provided
    selector = `${options.prefix}-${selector}`;
  } else if (options.prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }

  return selector;
};
