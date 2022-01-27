import {
  apply, chain,
  filter, MergeStrategy,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import {normalize} from '@angular-devkit/core';
import {strings} from '@angular-devkit/core';
import { buildDefaultPath, getWorkspace } from "@schematics/angular/utility/workspace";
import { parseName } from "@schematics/angular/utility/parse-name";
import { camelize, classify } from "@angular-devkit/core/src/utils/strings";

type TailormapStateOptions = {
  name: string;
  path: string;
  project: string;
  flat: boolean;
  skipTests: boolean;
  addEffects: boolean;
};

export function state(options: TailormapStateOptions): Rule {
  return async (host: Tree, _context: SchematicContext) => {

    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project as string);

    if (options.path === undefined && project) {
      options.path = buildDefaultPath(project);
    }

    const parsedPath = parseName(options.path as string, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const movePath = (options.flat) ?
        normalize(options.path) :
        normalize(options.path + '/' + strings.dasherize(options.name));

    const templateSource = apply(url('./files/state'), [
      options.skipTests ? filter(path => !path.endsWith('.spec.ts')) : noop(),
      options.addEffects ? noop() : filter(path => !path.endsWith('.effects.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(movePath),
    ]);

    _context.logger.info('\x1b[36m ################\x1b[0m');
    _context.logger.info(`\x1b[36m Don't forget to add the reducer to the module import: StoreModule.forFeature(${camelize(options.name)}StateKey, ${camelize(options.name)}Reducer)\x1b[0m`);
    if (options.addEffects) {
      _context.logger.info(`\x1b[36m Don't forget to add the effects to the module import: EffectsModule.forFeature([${classify(options.name)}Effects])\x1b[0m`);
    }
    _context.logger.info('\x1b[36m ################\x1b[0m');
    return chain([
        mergeWith(templateSource, MergeStrategy.Default)
    ]);
  };
}
